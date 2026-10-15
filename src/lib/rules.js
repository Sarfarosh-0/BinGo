/**
 * Fetches and validates public/rules.json (Technical Approach §5.1).
 * Throws on network failure or schema violation.
 */
export async function loadRules() {
  const url = `${import.meta.env.BASE_URL || '/'}rules.json`
  const res = await fetch(url, { cache: 'no-cache' })
  if (!res.ok) throw new Error(`rules_http_${res.status}`)
  const data = await res.json()

  if (!data || typeof data !== 'object') throw new Error('rules_invalid')
  if (!data.categories || typeof data.categories !== 'object') throw new Error('rules_missing_categories')
  if (!data.fallback || typeof data.fallback.message !== 'string') throw new Error('rules_missing_fallback')

  const required = ['recyclable', 'organic', 'ewaste', 'hazardous', 'general']
  for (const id of required) {
    const cat = data.categories[id]
    if (!cat || !cat.label || !Array.isArray(cat.steps) || cat.steps.length === 0 || !cat.sdgFact) {
      throw new Error(`rules_category_invalid:${id}`)
    }
    // Guide content (CategoryGuideModal) is served from the same file so there is one source of truth.
    if (
      !cat.title ||
      !cat.binColor ||
      !Array.isArray(cat.accepted) ||
      cat.accepted.length === 0 ||
      !Array.isArray(cat.notAccepted) ||
      !cat.tips ||
      !cat.guideFact
    ) {
      throw new Error(`rules_guide_invalid:${id}`)
    }
  }

  return data
}
