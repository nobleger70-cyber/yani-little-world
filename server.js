const express = require('express');
const webpush = require('web-push');
const path = require('path');
const app = express();
app.use(express.json({limit:'100kb'}));
app.use(express.static(path.join(__dirname,'public')));
const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT='mailto:you@example.com', PORT=3000 } = process.env;
if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) console.warn('Set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY before enabling push.');
else webpush.setVapidDetails(VAPID_SUBJECT,VAPID_PUBLIC_KEY,VAPID_PRIVATE_KEY);
// Demo storage: subscriptions reset when the server restarts. Use a database for a permanent deployment.
const subscriptions = new Map();
app.get('/api/vapid-public-key',(req,res)=>{if(!VAPID_PUBLIC_KEY)return res.status(503).json({error:'Push service is not configured.'});res.json({publicKey:VAPID_PUBLIC_KEY})});
app.post('/api/subscribe',(req,res)=>{const {deviceId,subscription}=req.body||{};if(!deviceId||!subscription?.endpoint)return res.status(400).json({error:'Missing device subscription.'});subscriptions.set(deviceId,subscription);res.json({ok:true})});
app.post('/api/miss',async(req,res)=>{const {deviceId}=req.body||{};if(!deviceId)return res.status(400).json({error:'Missing device ID.'});if(!VAPID_PUBLIC_KEY||!VAPID_PRIVATE_KEY)return res.status(503).json({error:'Push service is not configured yet.'});const targets=[...subscriptions.entries()].filter(([id])=>id!==deviceId);if(!targets.length)return res.json({sent:0,error:'The other phone has not enabled notifications yet.'});let sent=0;await Promise.all(targets.map(async([id,sub])=>{try{await webpush.sendNotification(sub,JSON.stringify({title:'Noble misses you ❤️',body:'A little reminder from your favourite person. Tap to open your little world.',url:'/'}));sent++}catch(err){if(err.statusCode===404||err.statusCode===410)subscriptions.delete(id);console.error('Push failed:',err.message)}}));res.json({sent});});
app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));
app.listen(PORT,()=>console.log(`Just Us is running on port ${PORT}`));
