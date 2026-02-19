const admin = require("firebase-admin");

// Render ရဲ့ Environment Variable ကနေ Key ကို ဖတ်ခြင်း
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://wingo-game-30123-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();

console.log("စက်ရုပ်ကို ၁ မိနစ်တစ်ခါ ပို့ရန် စတင်လိုက်ပါပြီ...");

// ၁ မိနစ် (၆၀၀၀၀ မီလီစက္ကန့်) တိုင်း အလုပ်လုပ်မည့် စနစ်
setInterval(() => {
    const now = new Date();
    // နာရီနှင့် မိနစ်ကိုပေါင်းပြီး Period လုပ်ခြင်း (ဥပမာ - 1505)
    const pid = now.getHours().toString().padStart(2, '0') + now.getMinutes().toString().padStart(2, '0');
    
    // Big သို့မဟုတ် Small ကို ကျပန်းရွေးခြင်း
    const result = Math.random() > 0.5 ? "Big" : "Small";

    // Firebase သို့ 'history' node အောက်မှာ သိမ်းဆည်းခြင်း
    db.ref('history/' + pid).set({
        period: pid,
        result: result
    }, (error) => {
        if (!error) {
            console.log("ပို့ပြီးပြီ - Period #" + pid + " : " + result);
        }
    });

}, 60000); 
