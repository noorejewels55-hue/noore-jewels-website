/**
 * 💎 Noore Jewels — Jewelry Trend Research Tool
 * 
 * This tool helps you find:
 * 1. Trending jewelry search terms in India (Google Trends)
 * 2. Reel/content ideas based on what's hot right now
 * 3. Product ideas for your store
 * 4. Trending hashtags for Instagram
 * 
 * Usage: node tools/trend-finder.js
 * Options:
 *   node tools/trend-finder.js --category necklace
 *   node tools/trend-finder.js --category earrings
 *   node tools/trend-finder.js --category bracelet
 *   node tools/trend-finder.js --category ring
 *   node tools/trend-finder.js --all
 */

const googleTrends = require('google-trends-api');

// ─── Configuration ────────────────────────────────────────────
const JEWELRY_CATEGORIES = {
    necklace: [
        'American Diamond necklace',
        'AD necklace set',
        'CZ necklace design',
        'imitation necklace set',
        'trendy necklace design 2026',
        'bridal necklace imitation',
        'choker necklace trending',
        'layered necklace fashion',
        'pearl necklace trendy',
        'kundan necklace design',
        'mangalsutra design trending',
        'statement necklace fashion',
    ],
    earrings: [
        'American Diamond earrings',
        'AD earrings design',
        'CZ drop earrings',
        'jhumka design trending',
        'trendy earrings 2026',
        'stud earrings fashion',
        'hoop earrings trendy',
        'chandbali earrings',
        'danglers earrings trending',
        'ear cuff trending',
        'oxidised earrings',
        'pearl earrings fashion',
    ],
    bracelet: [
        'American Diamond bracelet',
        'AD bracelet design',
        'charm bracelet trendy',
        'tennis bracelet fashion',
        'bangle design trending 2026',
        'kada bracelet fashion',
        'evil eye bracelet trending',
        'beaded bracelet trendy',
        'cuff bracelet design',
        'friendship bracelet trendy',
    ],
    ring: [
        'American Diamond ring',
        'AD ring design',
        'CZ solitaire ring',
        'trendy ring design 2026',
        'cocktail ring fashion',
        'stackable rings trending',
        'engagement ring imitation',
        'butterfly ring trending',
        'adjustable ring trendy',
        'couple ring trending',
    ],
    general: [
        'American Diamond jewellery',
        'AD jewellery trending',
        'CZ jewellery online',
        'imitation jewellery trending',
        'fashion jewellery 2026',
        'trendy jewellery India',
        'affordable diamond jewellery',
        'anti tarnish jewellery',
        'wedding imitation jewellery',
        'office wear jewellery',
        'college wear jewellery',
        'party wear jewellery trendy',
    ],
};

const REEL_IDEAS_BY_TREND = {
    'necklace': [
        '✨ "One necklace, 5 outfits" — style the same AD necklace with different looks',
        '📦 "Order packing ASMR" — pack a necklace order beautifully on camera',
        '💎 "Real vs AD" — hold a real diamond necklace next to yours, show they look same',
        '🎬 "Get Ready With Me" — put on a stunning necklace as the final touch',
        '📸 "Necklace of the Day" — daily series showing different necklaces',
        '🔥 "Before & After" — plain outfit vs with your AD necklace',
        '💰 "Under ₹1500 necklace that looks ₹15,000" — price reveal reel',
    ],
    'earrings': [
        '✨ "Earring transformation" — show boring outfit → add your earrings → stunning',
        '👂 "Earring haul" — try on 5-6 different earring styles back to back',
        '🎵 "POV: Finding the perfect earring" — trending audio + product showcase',
        '💧 "Water test" — dip earrings in water to show anti-tarnish quality',
        '🤳 "Selfie angle guide" — best angles to show off your earrings',
        '🌧️ "Will it tarnish?" — wear earrings in rain/water to prove quality',
    ],
    'bracelet': [
        '⌚ "Stack game strong" — show bracelet stacking combinations',
        '✨ "Wrist candy" — close-up sparkle shots in natural light',
        '🎁 "Best gift under ₹500" — bracelet as a gift idea reel',
        '💪 "Everyday bracelet" — show wearing it all day without tarnish',
        '📏 "Adjustable bracelet hack" — show how your bracelets fit all sizes',
    ],
    'ring': [
        '💍 "Ring try-on" — try on different ring styles, ask audience to pick',
        '✋ "Ring stacking guide" — how to style multiple rings on one hand',
        '💎 "Can you tell it\'s not real?" — close-up comparison content',
        '🎁 "Valentine/Anniversary gift under ₹500" — ring as gift',
        '📸 "Hand pose guide" — best poses to show off your ring',
    ],
    'general': [
        '🏠 "Behind the scenes" — show your workspace, how you pick & pack',
        '📦 "Small business order packing" — satisfying packaging ASMR',
        '📊 "Most sold product this week" — create curiosity',
        '🎯 "Which one would you pick?" — show 2-3 products, poll audience',
        '💬 "Customer review reading" — read happy customer messages',
        '🚚 "Your order is on its way" — show shipping process',
        '📸 "New arrival alert" — dramatic reveal of new product',
        '🎵 "Jewelry collection tour" — show entire collection with trending audio',
        '💡 "Jewellery care tips" — how to maintain AD jewelry',
        '🔥 "Trending vs Classic" — compare trendy and classic pieces',
    ],
};

const HASHTAG_SETS = {
    necklace: '#ADnecklace #AmericanDiamondNecklace #CZnecklace #necklacedesign #trendynecklace #imitationnecklace #fashionjewellery #necklaceset #jewellerylovers #necklacelove #indianjewellery #affordableluxury #NJnecklace',
    earrings: '#ADearrings #AmericanDiamondEarrings #trendyearrings #jhumka #earringsoftheday #fashionearrings #CZearrings #danglers #studearrings #earringslover #indianearrings #affordablejewellery',
    bracelet: '#ADbracelet #braceletlovers #trendybracelet #fashionbracelet #CZbracelet #wristcandy #braceletstack #armcandy #affordablebracelets #indianjewellery',
    ring: '#ADring #trendyring #CZring #fashionring #ringdesign #ringsofinstagram #imitationring #affordablerings #solitairering #stackablerings',
    general: '#NJjewels #AmericanDiamond #ADjewellery #CZjewellery #trendyjewellery2026 #fashionjewelleryIndia #imitationjewellery #affordableluxury #antitarnish #jewellerytrends #smallbusinessindia #indianfashion #jewelleryonline #NJfamily',
};

// ─── Helper Functions ─────────────────────────────────────────

async function getTrendingKeywords(keywords, category) {
    console.log(`\n🔍 Fetching Google Trends for: ${category.toUpperCase()}...\n`);

    const results = [];

    // Process in batches of 5 (Google Trends limit)
    for (let i = 0; i < keywords.length; i += 5) {
        const batch = keywords.slice(i, i + 5);
        try {
            const data = await googleTrends.interestOverTime({
                keyword: batch,
                geo: 'IN',
                startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            });

            const parsed = JSON.parse(data);
            if (parsed.default && parsed.default.timelineData) {
                const timeline = parsed.default.timelineData;

                // Get average interest for each keyword
                batch.forEach((kw, idx) => {
                    const avgInterest = timeline.reduce((sum, point) => {
                        return sum + (point.value[idx] || 0);
                    }, 0) / (timeline.length || 1);

                    // Check if trending up (compare last week vs previous)
                    const recentPoints = timeline.slice(-7);
                    const olderPoints = timeline.slice(-14, -7);
                    const recentAvg = recentPoints.reduce((s, p) => s + (p.value[idx] || 0), 0) / (recentPoints.length || 1);
                    const olderAvg = olderPoints.reduce((s, p) => s + (p.value[idx] || 0), 0) / (olderPoints.length || 1);

                    const trend = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg * 100) : 0;

                    results.push({
                        keyword: kw,
                        interest: Math.round(avgInterest),
                        recentInterest: Math.round(recentAvg),
                        trend: Math.round(trend),
                        trending: trend > 10,
                    });
                });
            }

            // Small delay to avoid rate limiting
            await new Promise(r => setTimeout(r, 1000));
        } catch (err) {
            // If error, still add keywords with default values
            batch.forEach(kw => {
                results.push({ keyword: kw, interest: 0, recentInterest: 0, trend: 0, trending: false });
            });
        }
    }

    return results.sort((a, b) => b.recentInterest - a.recentInterest);
}

async function getRelatedQueries(keyword) {
    try {
        const data = await googleTrends.relatedQueries({
            keyword,
            geo: 'IN',
            startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        });

        const parsed = JSON.parse(data);
        const rising = parsed.default?.rankedList?.[1]?.rankedKeyword || [];
        return rising.slice(0, 8).map(item => ({
            query: item.query,
            value: item.formattedValue || item.value,
        }));
    } catch {
        return [];
    }
}

async function getDailyTrends() {
    try {
        const data = await googleTrends.dailyTrends({ geo: 'IN' });
        const parsed = JSON.parse(data);
        const trends = parsed.default?.trendingSearchesDays?.[0]?.trendingSearches || [];

        // Filter for jewelry-related trends
        const jewelryKeywords = ['jewel', 'ring', 'necklace', 'earring', 'bracelet', 'diamond', 'gold', 'fashion', 'wedding', 'bridal'];
        const relevant = trends.filter(t => {
            const title = (t.title?.query || '').toLowerCase();
            const articles = (t.articles || []).map(a => (a.title || '').toLowerCase()).join(' ');
            return jewelryKeywords.some(kw => title.includes(kw) || articles.includes(kw));
        });

        return relevant.map(t => t.title?.query || 'Unknown');
    } catch {
        return [];
    }
}

// ─── Display Functions ────────────────────────────────────────

function displayResults(results, category) {
    console.log('═'.repeat(70));
    console.log(`  💎 TRENDING JEWELRY KEYWORDS — ${category.toUpperCase()}`);
    console.log('═'.repeat(70));
    console.log('');

    // Hot trends (trending up)
    const hot = results.filter(r => r.trending);
    if (hot.length > 0) {
        console.log('  🔥 HOT RIGHT NOW (trending up):');
        console.log('  ─'.repeat(35));
        hot.forEach(r => {
            const bar = '█'.repeat(Math.min(Math.round(r.recentInterest / 5), 20));
            console.log(`  📈 ${r.keyword}`);
            console.log(`     Interest: ${bar} ${r.recentInterest}/100  (+${r.trend}%)`);
        });
        console.log('');
    }

    // All results
    console.log('  📊 ALL KEYWORDS (by search interest):');
    console.log('  ─'.repeat(35));
    results.forEach((r, i) => {
        const icon = r.trending ? '🔥' : (r.recentInterest > 30 ? '✅' : '○');
        const trendIcon = r.trend > 0 ? `↑${r.trend}%` : (r.trend < 0 ? `↓${Math.abs(r.trend)}%` : '→');
        console.log(`  ${icon} ${(i + 1).toString().padStart(2)}. ${r.keyword.padEnd(35)} Interest: ${r.recentInterest.toString().padStart(3)}/100  ${trendIcon}`);
    });
    console.log('');
}

function displayReelIdeas(category) {
    const ideas = REEL_IDEAS_BY_TREND[category] || REEL_IDEAS_BY_TREND.general;
    console.log('═'.repeat(70));
    console.log(`  🎬 REEL IDEAS — ${category.toUpperCase()}`);
    console.log('═'.repeat(70));
    console.log('');
    ideas.forEach((idea, i) => {
        console.log(`  ${i + 1}. ${idea}`);
    });

    // Always show general ideas too
    if (category !== 'general') {
        console.log('');
        console.log('  📌 BONUS GENERAL REEL IDEAS:');
        REEL_IDEAS_BY_TREND.general.slice(0, 5).forEach((idea, i) => {
            console.log(`  ${i + 1}. ${idea}`);
        });
    }
    console.log('');
}

function displayHashtags(category) {
    console.log('═'.repeat(70));
    console.log(`  # HASHTAGS — ${category.toUpperCase()}`);
    console.log('═'.repeat(70));
    console.log('');
    console.log(`  Category: ${HASHTAG_SETS[category] || HASHTAG_SETS.general}`);
    console.log('');
    console.log(`  General:  ${HASHTAG_SETS.general}`);
    console.log('');
    console.log('  💡 TIP: Copy category + general hashtags together for best reach!');
    console.log('');
}

function displayProductIdeas(trendingKeywords) {
    console.log('═'.repeat(70));
    console.log('  🛍️ PRODUCT IDEAS BASED ON TRENDS');
    console.log('═'.repeat(70));
    console.log('');

    const hot = trendingKeywords.filter(r => r.recentInterest > 20);
    if (hot.length > 0) {
        console.log('  Based on what people are searching, you should stock:');
        console.log('');
        hot.forEach(r => {
            const suggestion = getProductSuggestion(r.keyword);
            console.log(`  🎯 "${r.keyword}" (Interest: ${r.recentInterest}/100)`);
            console.log(`     → ${suggestion}`);
            console.log('');
        });
    } else {
        console.log('  No strong trending keywords found right now.');
        console.log('  Try running the tool again in a few days to catch new trends!');
    }
    console.log('');
}

function getProductSuggestion(keyword) {
    const kw = keyword.toLowerCase();
    if (kw.includes('choker')) return 'Source trendy choker necklaces in AD/CZ. Very popular with young women.';
    if (kw.includes('layered')) return 'Add layered/multi-chain necklaces. Great for Instagram content!';
    if (kw.includes('bridal') || kw.includes('wedding')) return 'Add a bridal collection section — high-value orders!';
    if (kw.includes('jhumka')) return 'Traditional jhumka earrings in AD stones sell very well.';
    if (kw.includes('hoop')) return 'AD hoop earrings are minimal & trendy. Great for everyday wear content.';
    if (kw.includes('tennis')) return 'Tennis bracelets in CZ are very popular. High perceived value.';
    if (kw.includes('stackable') || kw.includes('stack')) return 'Stackable rings/bracelets let customers buy multiple pieces!';
    if (kw.includes('adjustable')) return 'Adjustable rings are beginner-friendly — no sizing issues, easy sell!';
    if (kw.includes('pearl')) return 'Pearl + AD combo pieces are trending. Very elegant and photogenic.';
    if (kw.includes('kundan')) return 'Kundan-style AD sets are popular for weddings and festivals.';
    if (kw.includes('mangalsutra')) return 'Modern AD mangalsutra designs — huge market!';
    if (kw.includes('cuff')) return 'Ear cuffs and bracelet cuffs are trending for edgy fashion content.';
    if (kw.includes('cocktail')) return 'Large cocktail rings are great for party-wear content.';
    if (kw.includes('evil eye')) return 'Evil eye bracelets/pendants are consistently trending!';
    if (kw.includes('oxidised') || kw.includes('oxidized')) return 'Oxidised jewelry is huge on Instagram. Very photogenic.';
    if (kw.includes('chandbali')) return 'Chandbali earrings are always in demand for ethnic wear.';
    return 'Consider sourcing similar products. Search Meesho/IndiaMART for wholesale AD versions.';
}

// ─── Main ─────────────────────────────────────────────────────

async function main() {
    const args = process.argv.slice(2);
    let category = 'general';

    if (args.includes('--all')) {
        category = 'all';
    } else if (args.includes('--category')) {
        const catIdx = args.indexOf('--category');
        category = args[catIdx + 1] || 'general';
    } else if (args[0]) {
        category = args[0];
    }

    console.log('');
    console.log('╔══════════════════════════════════════════════════════════════════════╗');
    console.log('║          💎 NOORE JEWELS — JEWELRY TREND RESEARCH TOOL 💎           ║');
    console.log('╚══════════════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`  📅 Date: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);
    console.log(`  📍 Market: India`);
    console.log(`  🔎 Category: ${category === 'all' ? 'ALL CATEGORIES' : category.toUpperCase()}`);
    console.log('');

    const categoriesToSearch = category === 'all'
        ? Object.keys(JEWELRY_CATEGORIES)
        : [category in JEWELRY_CATEGORIES ? category : 'general'];

    for (const cat of categoriesToSearch) {
        const keywords = JEWELRY_CATEGORIES[cat];
        if (!keywords) continue;

        // Get trending data
        const results = await getTrendingKeywords(keywords, cat);
        displayResults(results, cat);
        displayReelIdeas(cat);
        displayHashtags(cat);
        displayProductIdeas(results);
    }

    // Get related rising queries for "American Diamond jewellery"
    console.log('═'.repeat(70));
    console.log('  🚀 RISING SEARCHES (people are suddenly searching for these):');
    console.log('═'.repeat(70));
    console.log('');

    const risingQueries = await getRelatedQueries('American Diamond jewellery');
    if (risingQueries.length > 0) {
        risingQueries.forEach((q, i) => {
            console.log(`  ${i + 1}. "${q.query}" — ${q.value}`);
        });
    } else {
        console.log('  Could not fetch rising queries. Try again later.');
    }

    console.log('');
    console.log('═'.repeat(70));
    console.log('  💡 HOW TO USE THESE INSIGHTS');
    console.log('═'.repeat(70));
    console.log('');
    console.log('  1. 🔥 HOT KEYWORDS → Search these on Meesho/IndiaMART for products to source');
    console.log('  2. 🎬 REEL IDEAS → Create reels based on trending product types');
    console.log('  3. # HASHTAGS → Use these when posting your reels on Instagram');
    console.log('  4. 🛍️ PRODUCT IDEAS → Stock the products people are searching for');
    console.log('  5. 🚀 RISING SEARCHES → Jump on these before they become mainstream');
    console.log('');
    console.log('  Run this tool weekly to stay ahead of trends! 🚀');
    console.log('');
}

main().catch(console.error);
