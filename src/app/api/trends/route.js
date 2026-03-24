import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import googleTrends from 'google-trends-api';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// ─── Jewelry Keywords to Track ──────────────────────────────
const CATEGORIES = {
    necklace: [
        'lab grown diamond necklace', 'solitaire pendant necklace', 'diamond necklace gold',
        'tennis necklace diamond', 'diamond mangalsutra design', 'bridal diamond necklace',
        'IGI certified diamond necklace', 'diamond choker necklace', 'diamond pendant 14kt gold',
    ],
    earrings: [
        'lab grown diamond earrings', 'diamond stud earrings', 'solitaire earrings gold',
        'diamond drop earrings', 'diamond hoop earrings', 'diamond jhumka',
        'IGI certified diamond studs', 'diamond earrings 18kt gold', 'diamond chandbali',
    ],
    bracelet: [
        'lab grown diamond bracelet', 'diamond tennis bracelet', 'diamond bangle gold',
        'solitaire bracelet trending', 'diamond bracelet 14kt', 'diamond cuff bracelet',
    ],
    ring: [
        'lab grown diamond ring', 'solitaire engagement ring', 'diamond ring 14kt gold',
        'diamond eternity ring', 'diamond cocktail ring', 'couple diamond ring',
    ],
};

const REEL_IDEAS = [
    '✨ "One piece, 5 outfits" → Style same diamond jewelry with different looks',
    '📦 "Order Packing ASMR" → Film yourself packing diamond orders in luxury boxes',
    '💎 "Lab Grown vs Mined" → Show they look identical, but lab grown is 60% less!',
    '🔬 "Under the loupe" → Show IGI certificate + diamond under magnification',
    '💰 "₹30,000 vs ₹90,000" → Compare lab grown vs mined — same brilliance!',
    '🎬 "Get Ready With Me" → Put on diamond jewelry as the final outfit touch',
    '🎯 "Which one would you pick?" → Show 2-3 diamond pieces, poll audience',
    '📊 "Best seller this week" → Show your most popular diamond piece',
    '💬 "Reading customer reviews" → Show real happy messages + unboxing videos',
    '🔥 "Before & After" → Plain outfit vs with real diamond jewelry',
    '📸 "New Arrival Alert" → Dramatic diamond product reveal with sparkle close-ups',
    '💡 "Diamond care tips" → How to clean and maintain your lab grown diamonds',
    '📜 "What is IGI certification?" → Educate about diamond grading and certificates',
    '🏭 "How lab diamonds are made" → Show the CVD/HPHT process (educational)',
];

// ─── Fetch Trends ───────────────────────────────────────────
async function getTrends(keywords, category) {
    const results = [];

    for (let i = 0; i < keywords.length; i += 5) {
        const batch = keywords.slice(i, i + 5);
        try {
            const data = await googleTrends.interestOverTime({
                keyword: batch,
                geo: 'IN',
                startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            });

            const parsed = JSON.parse(data);
            if (parsed.default?.timelineData) {
                const timeline = parsed.default.timelineData;
                batch.forEach((kw, idx) => {
                    const recentPoints = timeline.slice(-7);
                    const olderPoints = timeline.slice(-14, -7);
                    const recentAvg = recentPoints.reduce((s, p) => s + (p.value[idx] || 0), 0) / (recentPoints.length || 1);
                    const olderAvg = olderPoints.reduce((s, p) => s + (p.value[idx] || 0), 0) / (olderPoints.length || 1);
                    const trend = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg * 100) : 0;

                    results.push({
                        keyword: kw,
                        interest: Math.round(recentAvg),
                        trend: Math.round(trend),
                        hot: trend > 10,
                    });
                });
            }
            await new Promise(r => setTimeout(r, 1000));
        } catch {
            batch.forEach(kw => results.push({ keyword: kw, interest: 0, trend: 0, hot: false }));
        }
    }

    return results.sort((a, b) => b.interest - a.interest);
}

// ─── Build HTML Email ───────────────────────────────────────
function buildEmail(allResults) {
    const date = new Date().toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    let categoryHtml = '';

    for (const [cat, results] of Object.entries(allResults)) {
        const rows = results.map(r => {
            const icon = r.hot ? '🔥' : (r.interest > 20 ? '✅' : '○');
            const trendText = r.trend > 0 ? `<span style="color:#22c55e;">↑${r.trend}%</span>` :
                (r.trend < 0 ? `<span style="color:#ef4444;">↓${Math.abs(r.trend)}%</span>` : '→');
            const bar = '█'.repeat(Math.min(Math.round(r.interest / 5), 15));
            const bgColor = r.hot ? 'rgba(239,68,68,0.08)' : 'transparent';

            return `
                <tr style="background:${bgColor};">
                    <td style="padding:8px 12px;font-size:14px;">${icon}</td>
                    <td style="padding:8px 12px;font-size:14px;font-weight:${r.hot ? '600' : '400'};">${r.keyword}</td>
                    <td style="padding:8px 12px;font-size:13px;color:#888;font-family:monospace;">${bar} ${r.interest}/100</td>
                    <td style="padding:8px 12px;font-size:13px;text-align:center;">${trendText}</td>
                </tr>
            `;
        }).join('');

        const hotItems = results.filter(r => r.hot || r.interest > 20);
        const actionHtml = hotItems.length > 0
            ? hotItems.map(r => `
                <div style="background:rgba(212,186,130,0.1);border-left:3px solid #C5A467;padding:10px 14px;margin:6px 0;border-radius:4px;">
                    <strong>🎯 "${r.keyword}"</strong> (Interest: ${r.interest}/100)<br/>
                    <span style="color:#666;font-size:13px;">→ Search this on Meesho/IndiaMART. People want this!</span>
                </div>
            `).join('')
            : '<p style="color:#999;font-size:13px;">No strong trends this week. Focus on existing bestsellers.</p>';

        categoryHtml += `
            <div style="margin-bottom:32px;">
                <h2 style="font-size:18px;color:#1a1a1a;border-bottom:2px solid #C5A467;padding-bottom:8px;text-transform:uppercase;">
                    💎 ${cat}
                </h2>
                <table style="width:100%;border-collapse:collapse;margin:12px 0;">
                    <tr style="background:#f8f8f8;">
                        <th style="padding:8px 12px;text-align:left;font-size:12px;color:#888;">—</th>
                        <th style="padding:8px 12px;text-align:left;font-size:12px;color:#888;">Keyword</th>
                        <th style="padding:8px 12px;text-align:left;font-size:12px;color:#888;">Search Interest</th>
                        <th style="padding:8px 12px;text-align:center;font-size:12px;color:#888;">Trend</th>
                    </tr>
                    ${rows}
                </table>
                <h3 style="font-size:15px;color:#333;margin-top:16px;">🛍️ Products to Source:</h3>
                ${actionHtml}
            </div>
        `;
    }

    // Pick 5 random reel ideas
    const shuffled = [...REEL_IDEAS].sort(() => 0.5 - Math.random());
    const selectedReels = shuffled.slice(0, 5);
    const reelHtml = selectedReels.map((r, i) => `
        <div style="background:#fafafa;padding:10px 14px;margin:6px 0;border-radius:6px;font-size:14px;">
            ${i + 1}. ${r}
        </div>
    `).join('');

    return `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f5f5f5;">
        <div style="max-width:650px;margin:20px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <div style="background:linear-gradient(135deg,#1a1a1a 0%,#2d2d2d 100%);padding:32px;text-align:center;">
                <h1 style="color:#C5A467;font-size:24px;margin:0 0 4px;font-weight:300;letter-spacing:2px;">NOORE JEWELS</h1>
                <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0;">Weekly Trend Research Report</p>
                <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:8px 0 0;">📅 ${date}</p>
            </div>

            <!-- Content -->
            <div style="padding:28px 24px;">
                
                <!-- Summary -->
                <div style="background:linear-gradient(135deg,rgba(212,186,130,0.08),rgba(212,186,130,0.18));border:1px solid rgba(212,186,130,0.3);border-radius:8px;padding:16px 20px;margin-bottom:24px;">
                    <p style="margin:0;font-size:14px;color:#333;line-height:1.6;">
                        Hi Kriti! 👋 Here's your weekly jewelry trend report. 
                        The 🔥 items are trending UP — consider sourcing these products and creating reels about them!
                    </p>
                </div>

                <!-- Categories -->
                ${categoryHtml}

                <!-- Reel Ideas -->
                <div style="margin-top:32px;border-top:2px solid #eee;padding-top:24px;">
                    <h2 style="font-size:18px;color:#1a1a1a;margin-bottom:12px;">🎬 This Week's Reel Ideas</h2>
                    <p style="font-size:13px;color:#666;margin-bottom:12px;">Pick 2-3 of these and film them this week:</p>
                    ${reelHtml}
                </div>

                <!-- Hashtags -->
                <div style="margin-top:24px;border-top:2px solid #eee;padding-top:24px;">
                    <h2 style="font-size:18px;color:#1a1a1a;margin-bottom:12px;"># Copy-Paste Hashtags</h2>
                    <div style="background:#fafafa;padding:14px;border-radius:6px;font-size:12px;color:#555;line-height:1.8;word-break:break-word;">
                        #LabGrownDiamonds #RealDiamonds #IGICertified #DiamondJewellery #LabDiamond 
                        #SolitaireRing #DiamondNecklace #DiamondEarrings #DiamondBracelet #EthicalDiamonds 
                        #SustainableLuxury #LabGrownDiamondIndia #14ktGold #18ktGold #925Silver 
                        #NJjewels #NooreJewels #DiamondRing #TennisBracelet #AffordableDiamonds
                    </div>
                </div>

                <!-- Action Steps -->
                <div style="margin-top:24px;background:#1a1a1a;color:#fff;border-radius:8px;padding:20px;text-align:center;">
                    <h3 style="color:#C5A467;font-size:16px;margin:0 0 12px;">📋 This Week's Action Plan</h3>
                    <p style="font-size:13px;color:rgba(255,255,255,0.7);margin:0;line-height:1.8;">
                        1. Check 🔥 trending diamond styles<br/>
                        2. Photograph new pieces → Add to Google Sheet<br/>
                        3. Film 2 diamond reels → Post with hashtags<br/>
                        4. Share on WhatsApp status + stories
                    </p>
                </div>
            </div>

            <!-- Footer -->
            <div style="padding:16px;text-align:center;background:#fafafa;border-top:1px solid #eee;">
                <p style="margin:0;font-size:11px;color:#999;">
                    Noore Jewels Trend Tool • Auto-generated report
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// ─── API Route ──────────────────────────────────────────────
export async function GET(request) {
    // Simple secret key check to prevent random people from triggering this
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key !== process.env.TREND_REPORT_KEY && key !== 'noore2026') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Fetch trends for all categories
        const allResults = {};
        for (const [cat, keywords] of Object.entries(CATEGORIES)) {
            allResults[cat] = await getTrends(keywords, cat);
        }

        // Build email
        const html = buildEmail(allResults);

        // Send email
        const gmailUser = process.env.GMAIL_USER || 'noore.jewels55@gmail.com';
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: gmailUser,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `"Noore Jewels Trends" <${gmailUser}>`,
            to: gmailUser,
            subject: `💎 Weekly Trend Report — ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`,
            html,
        });

        return NextResponse.json({
            success: true,
            message: 'Trend report sent to your email! 📧',
            summary: Object.entries(allResults).map(([cat, results]) => ({
                category: cat,
                topKeyword: results[0]?.keyword,
                topInterest: results[0]?.interest,
                hotCount: results.filter(r => r.hot).length,
            })),
        });

    } catch (error) {
        console.error('Trend report error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
