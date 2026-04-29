export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const API_KEY = "UUxubkJza0xmZ0puck5rZ0FNbno";
    const SENDER_ID = "DanDorSolar";
    
    try {
        const { action, to, sms } = req.query;
        
        // Check balance
        if (action === 'check-balance') {
            const balanceUrl = `https://sms.arkesel.com/sms/api?action=check-balance&api_key=${API_KEY}&response=json`;
            const response = await fetch(balanceUrl);
            const data = await response.json();
            return res.status(200).json(data);
        } 
        // Send SMS
        else if (action === 'send-sms') {
            if (!to || !sms) {
                return res.status(400).json({ error: 'Missing to or sms parameter' });
            }
            
            const apiUrl = `https://sms.arkesel.com/sms/api?action=send-sms&api_key=${API_KEY}&to=${to}&from=${SENDER_ID}&sms=${encodeURIComponent(sms)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            return res.status(200).json(data);
        }
        else {
            return res.status(400).json({ error: 'Invalid action. Use "check-balance" or "send-sms"' });
        }
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
