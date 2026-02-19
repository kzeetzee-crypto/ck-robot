const admin = require("firebase-admin");

// Render မှာ ထည့်မယ့် FIREBASE_KEY variable ကနေ ဖတ်မယ်
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://wingo-game-30123-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();

function generateResult() {
    const now = new Date();
    // Period ID ကို CK ပုံစံအတိုင်း ထုတ်ခြင်း (နာရီ+မိနစ်)
    const pid = now.getHours().toString().padStart(2,'0') + now.getMinutes().toString().padStart(2,'0');
    
    db.ref('admin/next_result').once('value', (snapshot) => {
        let res = snapshot.val();
        if (res === "Auto" || !res) {
            res = Math.random() > 0.5 ? "Big" : "Small";
        }

        db.ref('history').push({
            pid: pid,
            res: res,
            time: now.toISOString()
        }).then(() => {
            console.log(`Period #${pid} : ${res} ထွက်ပြီး`);
            // ရလဒ်ထွက်ပြီးရင် Auto ပြန်ပြောင်းမယ်
            db.ref('admin/next_result').set("Auto");
        });
    });
}

// ၁ မိနစ်တစ်ခါ အလုပ်လုပ်ခိုင်းခြင်း
setInterval(generateResult, 60000);
console.log("CK Robot is active and waiting for next minute...");
