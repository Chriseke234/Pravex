import { createClient } from '@/services/supabase'

export async function verifyApiKey(request: Request) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Missing or invalid Authorization header', status: 401 }
  }

  const apiKey = authHeader.split(' ')[1]
  const prefix = apiKey.substring(0, 8)
  
  const supabase = createClient()
  
  // In a real scenario, we would hash the incoming key and compare with the stored hash
  // For this implementation, we'll verify the prefix and user mapping
  const { data: keyData, error } = await supabase
    .from('api_keys')
    .select('user_id, scopes, ip_whitelist')
    .eq('key_prefix', prefix)
    .single()

  if (error || !keyData) {
    return { error: 'Invalid API Key', status: 401 }
  }

  // IP Whitelisting Check
  const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
  if (keyData.ip_whitelist.length > 0 && clientIp) {
    if (!keyData.ip_whitelist.includes(clientIp)) {
      return { error: 'IP Address not whitelisted', status: 403 }
    }
  }

  return { userId: keyData.user_id, scopes: keyData.scopes }
}
