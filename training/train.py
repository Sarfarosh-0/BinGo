#!/usr/bin/env python3
"""BinGo model training (CPU-friendly).
1) Map Kaggle + e-waste folders -> 5 PRD classes
2) Extract MobileNetV2 features once
3) Train a small classifier head on cached features
4) Assemble full Keras model and export TF.js to public/model/
"""

import json
import os
import sys
from pathlib import Path

import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.applications import MobileNetV2

ROOT = Path(__file__).resolve().parent.parent
KAGGLE = ROOT / "dataset" / "images" / "images"
EWASTE = ROOT / "dataset" / "modified-dataset"
OUT_MODEL = ROOT / "public" / "model"
WORK = ROOT / "training" / "work"

IMG_SIZE = 224
SEED = 42

MAPPING = {
    "plastic_water_bottles": "recyclable",
    "plastic_soda_bottles": "recyclable",
    "plastic_detergent_bottles": "recyclable",
    "plastic_food_containers": "recyclable",
    "glass_beverage_bottles": "recyclable",
    "glass_food_jars": "recyclable",
    "glass_cosmetic_containers": "recyclable",
    "aluminum_soda_cans": "recyclable",
    "aluminum_food_cans": "recyclable",
    "steel_food_cans": "recyclable",
    "cardboard_boxes": "recyclable",
    "cardboard_packaging": "recyclable",
    "newspaper": "recyclable",
    "office_paper": "recyclable",
    "magazines": "recyclable",
    "food_waste": "organic",
    "eggshells": "organic",
    "coffee_grounds": "organic",
    "tea_bags": "organic",
    "plastic_shopping_bags": "general",
    "plastic_trash_bags": "general",
    "disposable_plastic_cutlery": "general",
    "plastic_straws": "general",
    "plastic_cup_lids": "general",
    "paper_cups": "general",
    "styrofoam_cups": "general",
    "styrofoam_food_containers": "general",
    "clothing": "general",
    "shoes": "general",
    "aerosol_cans": "hazardous",
    "Battery": "ewaste",
    "Keyboard": "ewaste",
    "Microwave": "ewaste",
    "Mobile": "ewaste",
    "Mouse": "ewaste",
    "PCB": "ewaste",
    "Player": "ewaste",
    "Printer": "ewaste",
    "Television": "ewaste",
    "Washing Machine": "ewaste",
}

CLASS_ORDER = ["recyclable", "organic", "ewaste", "hazardous", "general"]
MAX_PER_CLASS = {
    "recyclable": 1500,
    "organic": 1500,
    "ewaste": 1500,
    "hazardous": 500,
    "general": 1500,
}


def list_images(folder: Path):
    if not folder.is_dir():
        return []
    return sorted(
        p for p in folder.rglob("*")
        if p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"} and p.is_file()
    )


def build_index():
    buckets = {c: [] for c in CLASS_ORDER}
    if KAGGLE.is_dir():
        for item in sorted(KAGGLE.iterdir()):
            if item.is_dir() and item.name in MAPPING:
                buckets[MAPPING[item.name]].extend(list_images(item))
    if EWASTE.is_dir():
        # modified-dataset/{train,val,test}/<Item>/*.jpg
        for split in sorted(EWASTE.iterdir()):
            if not split.is_dir():
                continue
            for item in sorted(split.iterdir()):
                if item.is_dir() and item.name in MAPPING:
                    buckets[MAPPING[item.name]].extend(list_images(item))

    rng = np.random.RandomState(SEED)
    for cls in CLASS_ORDER:
        paths = buckets[cls]
        cap = MAX_PER_CLASS[cls]
        if len(paths) > cap:
            idx = rng.choice(len(paths), size=cap, replace=False)
            paths = [paths[i] for i in sorted(idx)]
        buckets[cls] = paths
        print(f"  {cls:12s} {len(paths):5d}")
    return buckets


def preprocess(path_str):
    img = tf.io.read_file(path_str)
    img = tf.image.decode_image(img, channels=3, expand_animations=False)
    img.set_shape([None, None, 3])
    img = tf.image.resize(img, [IMG_SIZE, IMG_SIZE])
    img = tf.cast(img, tf.float32) / 255.0
    return img


def extract_features(paths, base, batch=32):
    feats = []
    ds = tf.data.Dataset.from_tensor_slices([str(p) for p in paths])
    ds = ds.map(preprocess, num_parallel_calls=tf.data.AUTOTUNE).batch(batch).prefetch(tf.data.AUTOTUNE)
    gap = tf.keras.layers.GlobalAveragePooling2D()
    for x in ds:
        f = base(x, training=False)
        f = gap(f)  # (batch, 7, 7, 1280) -> (batch, 1280)
        feats.append(f.numpy())
    return np.concatenate(feats, axis=0)


def main():
    os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")
    print("Indexing dataset...")
    buckets = build_index()
    total = sum(len(v) for v in buckets.values())
    print(f"Total: {total}")

    WORK.mkdir(parents=True, exist_ok=True)
    cache_path = WORK / "features.npz"

    print("Loading MobileNetV2 (ImageNet)...")
    base = MobileNetV2(
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
        include_top=False,
        weights="imagenet",
        alpha=1.0,
    )
    base.trainable = False

    if cache_path.exists():
        print("Loading cached features...")
        data = np.load(cache_path, allow_pickle=False)
        X_train, y_train = data["X_train"], data["y_train"]
        X_val, y_val = data["X_val"], data["y_val"]
        X_test, y_test = data["X_test"], data["y_test"]
    else:
        rng = np.random.RandomState(SEED)
        X_tr, y_tr, X_va, y_va, X_te, y_te = [], [], [], [], [], []
        for ci, cls in enumerate(CLASS_ORDER):
            paths = list(buckets[cls])
            if len(paths) < 10:
                print(f"WARNING: {cls} has only {len(paths)} images — skipping feature extraction")
                continue
            n = len(paths)
            n_te = max(1, int(n * 0.15))
            n_va = max(1, int(n * 0.15))
            n_tr = n - n_va - n_te
            perm = rng.permutation(n)
            paths = [paths[i] for i in perm]
            tr, va, te = paths[:n_tr], paths[n_tr:n_tr + n_va], paths[n_tr + n_va:]
            print(f"Extracting features for {cls} ({len(tr)} train)...")
            X_tr.append(extract_features(tr, base))
            y_tr.append(np.full(len(tr), ci, dtype=np.int32))
            print(f"  val {len(va)}, test {len(te)}...")
            X_va.append(extract_features(va, base))
            y_va.append(np.full(len(va), ci, dtype=np.int32))
            X_te.append(extract_features(te, base))
            y_te.append(np.full(len(te), ci, dtype=np.int32))

        X_train = np.concatenate(X_tr)
        y_train = np.concatenate(y_tr)
        X_val = np.concatenate(X_va)
        y_val = np.concatenate(y_va)
        X_test = np.concatenate(X_te)
        y_test = np.concatenate(y_te)
        np.savez_compressed(
            cache_path,
            X_train=X_train, y_train=y_train,
            X_val=X_val, y_val=y_val,
            X_test=X_test, y_test=y_test,
        )
        print(f"Cached features -> {cache_path}  shape={X_train.shape}")

    # Shuffle train
    rng = np.random.RandomState(SEED)
    perm = rng.permutation(len(X_train))
    X_train, y_train = X_train[perm], y_train[perm]

    print("Training classifier head...")
    head_in = keras.Input(shape=(X_train.shape[1],), name="features")
    x = layers.Dense(256, activation="relu")(head_in)
    x = layers.Dropout(0.3)(x)
    x = layers.Dense(128, activation="relu")(x)
    x = layers.Dropout(0.2)(x)
    head_out = layers.Dense(len(CLASS_ORDER), activation="softmax", name="predictions")(x)
    head = keras.Model(head_in, head_out, name="head")
    head.compile(
        optimizer=keras.optimizers.Adam(1e-3),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    head.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=30,
        batch_size=32,
        callbacks=[
            keras.callbacks.EarlyStopping(monitor="val_accuracy", patience=6, restore_best_weights=True)
        ],
        verbose=1,
    )

    loss, acc = head.evaluate(X_test, y_test, verbose=0)
    print(f"\nTEST accuracy: {acc * 100:.2f}%  (n={len(y_test)})")

    preds = head.predict(X_test, verbose=0).argmax(axis=-1)
    print("Per-class accuracy:")
    report = {"overall": float(acc), "perClass": {}, "classOrder": CLASS_ORDER, "totalTest": int(len(y_test))}
    for ci, cls in enumerate(CLASS_ORDER):
        mask = y_test == ci
        if not mask.any():
            continue
        cacc = float((preds[mask] == ci).mean())
        report["perClass"][cls] = {"accuracy": cacc, "support": int(mask.sum())}
        print(f"  {cls:12s} {cacc * 100:6.2f}%  (n={mask.sum()})")

    (WORK / "report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")

    # Assemble full deployable model: image -> MobileNetV2 -> head
    print("Assembling full model for TF.js export...")
    image_input = keras.Input(shape=(IMG_SIZE, IMG_SIZE, 3), name="image")
    scaled = layers.Rescaling(2.0, offset=-1.0, name="to_minus1_1")(image_input)  # [0,1] -> [-1,1]
    feats = base(scaled, training=False)
    feats = layers.GlobalAveragePooling2D(name="gap")(feats)
    preds = head(feats)
    full = keras.Model(image_input, preds, name="bingo")
    full.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])

    OUT_MODEL.mkdir(parents=True, exist_ok=True)
    for p in OUT_MODEL.glob("*"):
        if p.is_file():
            p.unlink()

    # Save as SavedModel then convert to TF.js GRAPH model (reliable for nested MobileNet).
    saved_model_dir = str(WORK / "saved_model")
    full.export(saved_model_dir)  # Keras 3 SavedModel export

    import subprocess
    import sys as _sys
    result = subprocess.run(
        [
            _sys.executable, "-m", "tensorflowjs.converters.converter",
            "--input_format=tf_saved_model",
            "--output_format=tfjs_graph_model",
            "--signature_name=serving_default",
            "--saved_model_tags=serve",
            saved_model_dir,
            str(OUT_MODEL),
        ],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print("tfjs converter stderr:", result.stderr[-2000:], file=_sys.stderr)
        raise RuntimeError("TF.js graph model conversion failed")

    metadata = {
        "labels": CLASS_ORDER,
        "inputShape": [IMG_SIZE, IMG_SIZE, 3],
        "inputRange": [0.0, 1.0],
        "threshold": 0.60,
        "version": 1,
        "format": "graph_model",
        "signature": "serving_default",
        "inputName": "image",
        "preprocessing": "pixels/255 then model applies Rescaling to [-1,1] internally",
    }
    (OUT_MODEL / "metadata.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")

    # Also save keras for debugging
    full.save(WORK / "bingo_full.keras")

    print(f"Exported -> {OUT_MODEL}")
    for p in sorted(OUT_MODEL.iterdir()):
        print(f"  {p.name:20s} {p.stat().st_size / 1024:8.1f} KB")
    print("DONE")


if __name__ == "__main__":
    main()
