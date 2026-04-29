export default async function handler(req, res) {
    // Enable CORS for your frontend
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Arkesel API credentials (stored securely on the backend)
    const API_KEY = "UUxubkJza0xmZ0puck5rZ0FNbno";
    const SENDER_ID = "DanDorSolar";
    
    try {
        const { action, to, sms } = req.query;
        
        // Check balance
        if (action === 'check-balance') {
            const balanceUrl = `https://sms.arkesel.com/sms/api?action=check-balance&api_key=${API_KEY}&response=json`;
            const response = await fetch(balanceUrl);
            const data = await response.json();
            res.status(200).json(data);
        } 
        // Send SMS
        else if (action === 'send-sms') {
            if (!to || !sms) {
                res.status(400).json({ error: 'Missing required parameters: to and sms' });
                return;
            }
            
            const apiUrl = `https://sms.arkesel.com/sms/api?action=send-sms&api_key=${API_KEY}&to=${to}&from=${SENDER_ID}&sms=${encodeURIComponent(sms)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            res.status(200).json(data);
        }
        else {
            res.status(400).json({ error: 'Invalid action. Use "check-balance" or "send-sms"' });
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
}