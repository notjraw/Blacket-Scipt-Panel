// ==UserScript==
// @name         Blacket Script Panel
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description   script panel for blacket.org
// @author       Jraw
// @match        *://blacket.org/*
// @match        *://*.blacket.org/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  /* ─── BLACKET COLORS ─────────────────────────────────────────────
     Pulled straight from their CSS:
     Panel bg:      #2f2f2f
     Panel edge:    #1e1e1e  (inset shadow / border)
     Input bg:      #1a1a1a
     Active tab bg: #3b3b3b
     Text primary:  #ffffff
     Text muted:    rgba(255,255,255,0.5)
     Accent blue:   #3b99fc
     Accent shadow: #1a6cbf  (darker edge of their buttons)
     Green:         #3ddc84
     Red:           #e05c5c
     Purple:        #c792ea
  ─────────────────────────────────────────────────────────────────── */

  /* ─── SCRIPTS REGISTRY ──────────────────────────────────────────── */
  const SCRIPTS = [
    {
      id: 'redblack',
      name: 'Red to Black Text',
      author: 'Franxe',
      version: '1.0',
      desc: 'Animates #big-name between red and black on a 2 second loop.',
      type: 'inject',
      requiresPanel: false,
      run: () => {
        if (document.getElementById('__redblack_style')) return 'Already active';
        const s = document.createElement('style');
        s.id = '__redblack_style';
        s.textContent = `@keyframes redToBlack{0%{color:#ff0000}50%{color:#000000}100%{color:#ff0000}}#big-name{animation:redToBlack 2s infinite !important}`;
        document.head.appendChild(s);
        return 'Animation injected';
      },
      stop: () => {
        document.getElementById('__redblack_style')?.remove();
        return 'Animation removed';
      }
    },
    {
      id: 'creditseditor',
      name: 'Credits Editor',
      author: 'Franxe',
      version: '1.1',
      desc: 'Add custom entries to the credits page. Only works on /credits.',
      type: 'inject',
      requiresPanel: false,
      run: () => {
        if (!window.location.pathname.startsWith('/credits')) return 'Only works on /credits page';
        if (document.getElementById('__ce_btn')) return 'Already active';
        const btn = document.createElement('div');
        btn.id = '__ce_btn';
        btn.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;background:#3b99fc;color:white;padding:10px 18px;border-radius:6px;cursor:pointer;font-family:"Titan One",sans-serif;font-size:14px;box-shadow:0 4px 12px rgba(59,153,252,0.4);';
        btn.textContent = '+ Add Credit';
        btn.onclick = () => {
          document.getElementById('__ce_modal')?.remove();
          const modal = document.createElement('div');
          modal.id = '__ce_modal';
          modal.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#2f2f2f;border:1px solid #1e1e1e;border-radius:10px;padding:24px;z-index:99999;width:360px;color:white;font-family:sans-serif;box-shadow:0 20px 60px rgba(0,0,0,0.8);';
          const fields = [['Username','username','text',''],['Role','role','text',''],['Color','color','text','#ffffff'],['Avatar URL','avatar','text',''],['Banner URL','banner','text',''],['Note','note','textarea','']];
          modal.innerHTML = `<div style="font-size:16px;font-weight:600;margin-bottom:16px;color:#fff;">Add New Credit</div>${fields.map(([l,id,type,def])=>`<div style="margin-bottom:10px;"><label style="font-size:11px;color:rgba(255,255,255,0.4);display:block;margin-bottom:3px;">${l}</label>${type==='textarea'?`<textarea id="ce_${id}" style="width:100%;padding:7px;background:#1a1a1a;border:1px solid #444;border-radius:5px;color:white;resize:vertical;min-height:48px;font-size:12px;" placeholder="${l}"></textarea>`:`<input id="ce_${id}" type="text" style="width:100%;padding:7px;background:#1a1a1a;border:1px solid #444;border-radius:5px;color:white;font-size:12px;" placeholder="${l}" value="${def}">`}</div>`).join('')}<div style="display:flex;gap:8px;margin-top:12px;"><button id="__ce_add" style="flex:1;padding:9px;background:#3b99fc;color:white;border:none;border-radius:5px;cursor:pointer;font-size:13px;font-weight:500;box-shadow:inset 0 -3px rgba(0,0,0,0.25);">Add</button><button id="__ce_cancel" style="padding:9px 16px;background:#3b3b3b;color:rgba(255,255,255,0.6);border:none;border-radius:5px;cursor:pointer;font-size:13px;">Cancel</button></div>`;
          document.body.appendChild(modal);
          document.getElementById('__ce_cancel').onclick = () => modal.remove();
          document.getElementById('__ce_add').onclick = () => {
            const u=document.getElementById('ce_username').value.trim();
            const r=document.getElementById('ce_role').value.trim();
            const c=document.getElementById('ce_color').value.trim()||'#fff';
            const a=document.getElementById('ce_avatar').value.trim();
            const b=document.getElementById('ce_banner').value.trim();
            const n=document.getElementById('ce_note').value.trim();
            if(!u||!r||!a||!b||!n){alert('Please fill in all fields.');return;}
            const container=document.querySelector('.styles__creditsContainer___fkEnvi-camelCase');
            if(!container){alert('Credits container not found.');return;}
            const id='ce_'+Math.random().toString(36).slice(2);
            container.insertAdjacentHTML('beforeend',`<div id="${id}" class="styles__creditsCreditContainer___bej3a-camelCase" style="cursor:pointer"><img class="styles__creditsCreditAvatar___4939A-camelCase" src="${a}" draggable="false"><div style="color:${c}" class="styles__creditsCreditName___20Cma-camelCase">[${r}] ${u}</div><div class="styles__creditsCreditNote___9benj-camelCase">${n}</div></div>`);
            modal.remove();
          };
        };
        document.body.appendChild(btn);
        return 'Credits editor ready';
      },
      stop: () => {
        document.getElementById('__ce_btn')?.remove();
        document.getElementById('__ce_modal')?.remove();
        return 'Credits editor removed';
      }
    },
    {
      id: 'randomuser',
      name: 'Random User Button',
      author: 'Franxe',
      version: '1.1',
      desc: 'Adds a random user picker next to the chat emoji button.',
      type: 'inject',
      requiresPanel: false,
      run: () => {
        if (document.getElementById('__rup_btn')) return 'Already active';
        const waitForBlacket = setInterval(() => {
          if (typeof window.blacket === 'undefined' || !window.blacket.requests) return;
          clearInterval(waitForBlacket);
          const emojiBtn = document.querySelector('.styles__chatEmojiButton___8RFa2-camelCase');
          if (!emojiBtn) return;
          const btn = document.createElement('div');
          btn.id = '__rup_btn';
          btn.className = 'styles__chatEmojiButton___8RFa2-camelCase';
          btn.innerHTML = '<i style="font-size:1.563vw" class="fas fa-user-circle"></i>';
          const popup = document.createElement('div');
          popup.id = '__rup_popup';
          popup.style.cssText = 'display:none;position:absolute;bottom:3vw;right:0;width:18vw;min-width:200px;background:#2f2f2f;border:1px solid #1e1e1e;border-radius:8px;padding:8px;z-index:99999;flex-direction:column;gap:6px;box-shadow:inset 0 -4px rgba(0,0,0,0.2),0 8px 24px rgba(0,0,0,0.6);';
          popup.innerHTML = `<div style="color:rgba(255,255,255,0.5);font-size:11px;font-weight:600;text-align:center;padding:4px 0 6px;border-bottom:1px solid #3b3b3b;margin-bottom:2px;letter-spacing:0.5px;">RANDOM USER</div><button id="__rup_get" style="width:100%;padding:7px;background:#3b99fc;color:white;border:none;border-radius:5px;cursor:pointer;font-size:12px;font-family:inherit;box-shadow:inset 0 -3px rgba(0,0,0,0.25);">Get New Player</button><div id="__rup_display" style="color:rgba(255,255,255,0.3);font-size:11px;text-align:center;padding:6px;">Click to get a random user</div>`;
          const chatContainer = document.querySelector('.styles__chatInputContainer___gkR4A-camelCase');
          if (chatContainer) { chatContainer.style.position='relative'; chatContainer.appendChild(popup); }
          else document.body.appendChild(popup);
          emojiBtn.parentNode.insertBefore(btn, emojiBtn.nextSibling);
          btn.addEventListener('click', e => { e.stopPropagation(); popup.style.display = popup.style.display==='flex'?'none':'flex'; popup.style.flexDirection='column'; });
          document.addEventListener('click', e => { if (!popup.contains(e.target)&&e.target!==btn&&!btn.contains(e.target)) popup.style.display='none'; });
          popup.addEventListener('click', e => e.stopPropagation());
          document.getElementById('__rup_get').addEventListener('click', async () => {
            const d = document.getElementById('__rup_display');
            d.innerHTML = '<span style="color:rgba(255,255,255,0.3)">Searching...</span>';
            try {
              await new Promise((resolve, reject) => {
                window.blacket.requests.get('/worker2/messages/0?limit=1000', data => {
                  if (!data.messages?.length) { reject(new Error('No messages')); return; }
                  const map = new Map();
                  data.messages.forEach(m => { if (m.author?.username) map.set(m.author.id, m.author); });
                  const users = Array.from(map.values());
                  if (!users.length) { reject(new Error('No users found')); return; }
                  const user = users[Math.floor(Math.random()*users.length)];
                  d.innerHTML = `<div style="display:flex;align-items:center;gap:8px;background:#1a1a1a;border:1px solid #3b3b3b;border-radius:6px;padding:7px;position:relative;overflow:hidden;"><img src="${user.banner||'/content/banners/Default.png'}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;opacity:0.2;"><img src="${user.avatar||'/content/blooks/Default.png'}" style="width:32px;height:32px;border-radius:5px;z-index:1;flex-shrink:0;"><span style="color:#fff;font-size:12px;font-weight:600;z-index:1;">${user.username}</span></div><button id="__rup_copy" style="width:100%;margin-top:4px;padding:6px;background:#3b3b3b;color:rgba(255,255,255,0.6);border:none;border-radius:5px;cursor:pointer;font-size:11px;font-family:inherit;">Copy Username</button>`;
                  document.getElementById('__rup_copy')?.addEventListener('click', () => {
                    navigator.clipboard.writeText(user.username);
                    const b = document.getElementById('__rup_copy');
                    if (b) { b.textContent='Copied!'; b.style.color='#3ddc84'; setTimeout(()=>{ if(b){b.textContent='Copy Username';b.style.color='rgba(255,255,255,0.6)';} },2000); }
                  });
                  resolve();
                });
              });
            } catch(e) { d.innerHTML = `<span style="color:#e05c5c">Error: ${e.message}</span>`; }
          });
        }, 100);
        return 'Random user button injected';
      },
      stop: () => {
        document.getElementById('__rup_btn')?.remove();
        document.getElementById('__rup_popup')?.remove();
        return 'Random user button removed';
      }
    },
    {
      id: 'badges',
      name: 'All Badges',
      author: 'Jraw',
      version: '1.0',
      desc: 'Injects all Blacket badges onto your profile header. Must be on a profile page.',
      type: 'inject',
      requiresPanel: false,
      run: () => {
        const data=[["OG","This is only given to OG members of Blacket. This is before the date of 09/01/2022."],["Big Spender","This is only given to users who have donated a lot to Blacket."],["Big Spender V","This is only given to users who have donated over $1,000 to Blacket! Highest tier of Big Spender! HUGE thanks to:\n- VenomVenom\n- Brendan"],["Developer","This is only given to users who have developed and tested the game."],["Verified Bot","This is only given to bots that have been verified by owners or developers."],["Legacy Ankh","This was only given to people who impressed Ankha in many ways. This badge is no longer obtainable."],["Artist","This is only given to artists who created the art for Blacket."],["Co-Owner","This is only given to the co-owners."],["Booster","This is only given to people who boosted the Blacket Discord server."],["Tester","This is only given to users who test the game."],["Staff","This is only given to staff members."],["Plus","This is only given to users who have purchased Plus."],["6 Month Veteran","Given to those who have been members of Blacket as a whole for 6 months."],["12 Month Veteran","Given to those who have been members of Blacket as a whole for 1 year."],["18 Month Veteran","This is only given to people who have been a member of Blacket as a whole for 1 and a half years."],["24 Month Veteran","This is only given to people who have been a member of Blacket as a whole for 2 years."],["30 Month Veteran","This is only given to people who have been a member of Blacket as a whole for 2 and a half years."],["36 Month Veteran","This is only given to people who have been a member of Blacket as a whole for 3 years."],["42 Month Veteran","This is only given to people who have been a member of Blacket as a whole for 3 and a half years."],["48 Month Veteran","This is only given to people who have been a member of Blacket as a whole for 4 years."],["Partner","This is for the partners of Blacket."],["Verified","This is only given to trusted members and known members."],["beanTroll","This is a very exclusive badge. You must praise Bean always.","/content/emojis/beanTroll.webp"],["Google","GoogleChroma is the goat.","/content/blooks/Mummy%20Ankha.webp"],["Mixer","This is only given to artists who created the sounds / music for Blacket.","/content/badges/Mixer.webp"],["Blacktuber","This is only given to people who create videos about Blacket on YouTube and have over 500 subscribers."]].map(([id,desc,img])=>({id,name:id,imageUrl:img||`/content/badges/${id}.webp`,description:desc}));
        localStorage.setItem('badges',JSON.stringify(data));
        const c=document.querySelector('.styles__headerBadges___ffKa4-camelCase');
        if(!c) return 'Badge container not found — open a profile first';
        c.innerHTML='';
        const bg=document.createElement('div');
        bg.className='styles__headerBadgeBg___12ogR-camelCase';
        c.appendChild(bg);
        data.forEach(b=>{
          const d=document.createElement('div');
          d.style='display:inline-block;cursor:pointer;margin-right:0.104vw';
          const i=document.createElement('img');
          i.loading='lazy'; i.src=b.imageUrl;
          i.style='width:1.563vw;display:inline-block;margin-left:0.130vw;z-index:1;position:relative';
          d.appendChild(i);
          d.onclick=()=>{
            document.body.insertAdjacentHTML('beforeend',`<div class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>${b.name} Badge<br><br>${b.description.replace(/\n/g,'<br>')}</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="__badge_close" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color:var(--accent);"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color:var(--accent);">Okay</div></div></div></div><input type="submit" style="opacity:0;display:none;"></form></div>`);
            document.getElementById('__badge_close').onclick=()=>document.querySelector('.arts__modal___VpEAD-camelCase').remove();
          };
          c.appendChild(d);
        });
        return 'All badges injected';
      },
      stop: () => { return 'Reload the page to reset badges'; }
    },
    {
      id: 'packopener',
      name: 'Pack Opener',
      author: 'Jraw',
      version: '1.0',
      desc: 'Bulk-opens packs from a prompt. Logs every pull with rarity colors and retries on failure.',
      type: 'console',
      requiresPanel: false,
      code: `const rarityOrder=Object.entries(blacket.rarities).sort((a,b)=>a[1].exp-b[1].exp).map(x=>x[0]);
const openPack=pack=>new Promise((resolve,reject)=>{
  blacket.requests.post("/worker3/open",{pack},(data,status)=>{
    if(status&&status!=="success")reject(new Error(status));
    else if(data?.error)reject(new Error(data.error));
    else if(!data?.blook)reject(new Error("No blook in response"));
    else resolve(data.blook);
  });
});
const main=async(pack,amount)=>{
  const pulled={};
  const price=blacket.packs[pack].price;
  const max_delay=Object.values(blacket.rarities).map(r=>r.wait).reduce((a,b)=>Math.max(a,b));
  let opened=0,spent=0,bestRarity=null,retries=0;
  const MAX_RETRIES=5;
  console.log(\`%cStarting: \${pack} x\${amount}\`,"color:#3b99fc;font-weight:bold;font-family:monospace");
  for(let i=0;i<amount;i++){
    try{
      const blook=await openPack(pack);
      const rarity=blacket.blooks[blook].rarity;
      const rData=blacket.rarities[rarity];
      blacket.user.tokens-=price;
      spent+=price;opened++;retries=0;
      pulled[blook]=(pulled[blook]||0)+1;
      if(!bestRarity||rData.exp>blacket.rarities[bestRarity].exp)bestRarity=rarity;
      console.log(\`%c[\${opened}/\${amount}] \${blook} (\${rarity}) | Spent: \${spent.toLocaleString()} | Remaining: \${blacket.user.tokens.toLocaleString()}\`,\`color:\${rData.color};font-family:monospace;font-size:1.1em\`);
      await new Promise(r=>setTimeout(r,rData.wait));
    }catch(err){
      retries++;
      if(retries>MAX_RETRIES){console.error("%cFailed too many times — aborting.","color:red;font-family:monospace");break;}
      const backoff=max_delay*2**retries;
      console.warn(\`%cError (\${retries}/\${MAX_RETRIES}), retrying in \${backoff}ms: \${err.message}\`,"color:orange;font-family:monospace");
      await new Promise(r=>setTimeout(r,backoff));i--;
    }
  }
  console.log("%c— Opening Complete —","color:#3b99fc;font-size:1.5em;font-weight:bold;font-family:monospace");
  Object.keys(pulled).sort((a,b)=>rarityOrder.indexOf(blacket.blooks[a].rarity)-rarityOrder.indexOf(blacket.blooks[b].rarity)).forEach(blook=>{
    const rarity=blacket.blooks[blook].rarity;
    console.log(\`%c\${blook} x\${pulled[blook]} [\${rarity}]\`,\`color:\${blacket.rarities[rarity].color};font-size:1.3em;font-family:monospace\`);
  });
};
let packs=Object.keys(blacket.packs);
let pack;
do{
  const input=prompt("What pack would you like to open?",packs[0]);
  if(input===null){console.log("%cCancelled.","color:red");throw "";}
  pack=packs.find(p=>p.toLowerCase()===input.toLowerCase());
}while(!pack);
let amount;
const max=Math.floor(blacket.user.tokens/blacket.packs[pack].price);
do{
  const input=prompt(\`How many packs would you like to open? (Maximum: \${max})\`);
  if(input===null){console.log("%cCancelled.","color:red");throw "";}
  amount=parseInt(input);
}while(!amount||amount<1||amount>max);
main(pack,amount);`
    },
    {
      id: 'invvalue',
      name: 'Inventory Value',
      author: 'Jraw',
      version: '1.0',
      desc: 'Calculates the total inventory value for any user. Uses bazaar history with IQR outlier removal.',
      type: 'console',
      requiresPanel: true,
      code: `(async()=>{
  const TARGET_PRICES=25,MAX_PAGES=4,MAX_RETRIES=3,REQUEST_DELAY=120,RETRY_DELAY=400,CONCURRENCY=4;
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const priceCache=new Map();
  const username=prompt("Enter a username to calculate inventory value:");
  if(!username)return;
  const userData=await(await fetch(\`/worker2/user/\${encodeURIComponent(username)}\`)).json();
  if(userData.error)return console.error("User not found.");
  const inventory=userData.user.blooks;
  const meta=await(await fetch("/data/index.json")).json();
  const blookMeta=meta.blooks;
  const RARITY_PRICES={Uncommon:5,Rare:20,Epic:75,Legendary:200};
  async function getAveragePrice(blookName){
    if(priceCache.has(blookName))return priceCache.get(blookName);
    for(let attempt=1;attempt<=MAX_RETRIES;attempt++){
      try{
        const cutoff=Date.now()-1000*60*60*24*90;
        let prices=[],page=1,lastMedian=null;
        while(page<=MAX_PAGES&&prices.length<TARGET_PRICES){
          const res=await fetch(\`/worker/staff/audit/\${page}?action=\${encodeURIComponent(JSON.stringify(["bazaar","bought"]))}&user=undefined&search=\${encodeURIComponent(\`"\${blookName}"\`)}\`);
          if(!res.ok)break;
          const data=await res.json();
          if(!data.audit?.length)break;
          for(const entry of data.audit){
            if(entry.date<cutoff)break;
            const match=entry.reason.match(/for\\s+(\\d+)\\s+tokens/i);
            if(match)prices.push(+match[1]);
          }
          if(page>=2&&prices.length<5)break;
          if(prices.length>=10){const sorted=[...prices].sort((a,b)=>a-b);const median=sorted[Math.floor(sorted.length/2)];if(median===lastMedian)break;lastMedian=median;}
          page++;await sleep(REQUEST_DELAY);
        }
        if(!prices.length)throw"No data";
        prices.sort((a,b)=>a-b);
        const q1=prices[Math.floor(prices.length*0.25)];
        const q3=prices[Math.floor(prices.length*0.75)];
        const iqr=q3-q1;
        const clean=prices.filter(p=>p>=q1-1.5*iqr&&p<=q3+1.5*iqr);
        const base=clean.length?clean:prices;
        const avg=Math.round(base.reduce((a,b)=>a+b,0)/base.length);
        priceCache.set(blookName,avg);return avg;
      }catch{await sleep(RETRY_DELAY);}
    }
    priceCache.set(blookName,null);return null;
  }
  const entries=Object.entries(inventory).filter(([,v])=>v>0);
  let results=[],failed=[];
  async function worker(queue){
    while(queue.length){
      const[blook,amount]=queue.shift();
      const info=blookMeta[blook];
      if(!info){failed.push(blook);continue;}
      let unit=RARITY_PRICES[info.rarity]||await getAveragePrice(blook);
      if(unit===null){failed.push(blook);continue;}
      results.push({blook,rarity:info.rarity,amount,unitPrice:unit,totalValue:unit*amount});
      console.log("✔ "+blook);
    }
  }
  const queue=[...entries];
  await Promise.all(Array.from({length:CONCURRENCY},()=>worker(queue)));
  const total=results.reduce((s,r)=>s+r.totalValue,0);
  console.table(results);
  console.log(\`Total inventory value for \${userData.user.username}: \${total.toLocaleString()} tokens\`);
  if(failed.length)console.warn("Failed to price:",failed);
})();`
    },
    {
      id: 'blookprice',
      name: 'Blook Price Tracker',
      author: 'Jraw',
      version: '1.0',
      desc: 'Analyzes bazaar sales history for a single blook. Shows average, cleaned average, and outliers.',
      type: 'console',
      requiresPanel: true,
      code: `(async()=>{
  const INPUT=prompt("Enter a blook name to analyze:");
  if(!INPUT)return console.log("No blook entered.");
  const blookName=\`"\${INPUT}"\`;
  const TARGET_MATCHES=100,DELAY_MS=120;
  const now=Date.now(),threeMonthsAgo=now-(1000*60*60*24*30*3);
  let page=1,collected=[];
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  console.log("Analyzing:",blookName);
  while(collected.length<TARGET_MATCHES){
    const url=\`/worker/staff/audit/\${page}?action=\${encodeURIComponent(JSON.stringify(["bazaar","bought"]))}&user=undefined&search=\${encodeURIComponent(blookName)}\`;
    const res=await fetch(url);
    if(!res.ok){console.error("Request failed on page",page);break;}
    const data=await res.json();
    const entries=data.audit||[];
    if(!entries.length)break;
    let stopByDate=false;
    for(const entry of entries){
      if(new Date(entry.date).getTime()<threeMonthsAgo){stopByDate=true;break;}
      const reason=entry.reason;
      if(!reason.includes(blookName))continue;
      const match=reason.match(/bought\\s+"(.+?)"\\s+from\\s+(.+?)\\s+\\((\\d+)\\)\\s+for\\s+(\\d+)\\s+tokens/i);
      if(!match)continue;
      collected.push({blook:match[1],buyer:entry.user.username,seller:match[2],sellerId:match[3],price:Number(match[4]),date:new Date(entry.date)});
      if(collected.length>=TARGET_MATCHES)break;
    }
    if(stopByDate||page>=data.pages)break;
    page++;await sleep(DELAY_MS);
  }
  if(!collected.length){console.log(\`No sales found for \${blookName} in the last 3 months.\`);return;}
  const prices=collected.map(s=>s.price).sort((a,b)=>a-b);
  const avg=prices.reduce((a,b)=>a+b,0)/prices.length;
  const q1=prices[Math.floor(prices.length*0.25)];
  const q3=prices[Math.floor(prices.length*0.75)];
  const iqr=q3-q1;
  const lower=q1-1.5*iqr,upper=q3+1.5*iqr;
  const outliers=collected.filter(s=>s.price<lower||s.price>upper);
  const clean=collected.filter(s=>s.price>=lower&&s.price<=upper);
  const cleanAvg=clean.reduce((a,b)=>a+b.price,0)/clean.length;
  console.log(\`Collected \${collected.length} sales\`);
  console.log("Average price (all):",avg.toFixed(2));
  console.log("Average price (no outliers):",cleanAvg.toFixed(2));
  if(outliers.length){console.log("Outliers:");console.table(outliers);}else console.log("No outliers found.");
  console.table(collected);
})();`
    }
  ];

  /* ─── STATE ──────────────────────────────────────────────────────── */
  const injected = {};
  let activeId = SCRIPTS[0].id;
  let panelVisible = true;
  let isDragging = false, dragOffX = 0, dragOffY = 0;

  /* ─── PANEL SHELL ────────────────────────────────────────────────── */
  const panel = document.createElement('div');
  panel.id = '__bkpanel';
  panel.style.cssText = `
    position:fixed;top:60px;right:20px;width:520px;
    background:#2f2f2f;
    border:1px solid #1a1a1a;
    border-radius:8px;
    box-shadow:inset 0 -4px rgba(0,0,0,0.3),0 8px 32px rgba(0,0,0,0.6);
    z-index:999999;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    overflow:hidden;user-select:none;
    display:flex;flex-direction:column;max-height:620px;
  `;

  panel.innerHTML = `
    <div id="__bkp_header" style="
      background:#252525;
      padding:9px 14px;
      display:flex;align-items:center;gap:10px;
      cursor:grab;
      border-bottom:1px solid #1a1a1a;
      flex-shrink:0;
      box-shadow:inset 0 -2px rgba(0,0,0,0.2);
    ">
      <div style="display:flex;gap:6px;align-items:center;">
        <div id="__bkp_close" style="width:12px;height:12px;border-radius:50%;background:#ff5f56;cursor:pointer;box-shadow:0 0 0 1px rgba(0,0,0,0.3);" title="Close"></div>
        <div id="__bkp_min"   style="width:12px;height:12px;border-radius:50%;background:#febc2e;cursor:pointer;box-shadow:0 0 0 1px rgba(0,0,0,0.3);" title="Minimize"></div>
        <div style="width:12px;height:12px;border-radius:50%;background:#28c840;box-shadow:0 0 0 1px rgba(0,0,0,0.3);"></div>
      </div>
      <div style="flex:1;text-align:center;color:rgba(255,255,255,0.35);font-size:12px;font-weight:500;letter-spacing:0.3px;">Scipt panel by Jraw</div>
      <div style="font-size:10px;color:rgba(255,255,255,0.15);font-family:monospace;">v3.0</div>
    </div>

    <div id="__bkp_tabs" style="
      display:flex;
      background:#252525;
      border-bottom:1px solid #1a1a1a;
      flex-shrink:0;
      overflow-x:auto;
      padding:0 4px;
      gap:0;
      scrollbar-width:none;
    "></div>

    <div style="display:flex;flex:1;overflow:hidden;min-height:0;">
      <div id="__bkp_main" style="flex:1;display:flex;flex-direction:column;overflow:hidden;background:#2f2f2f;"></div>
    </div>
  `;

  document.body.appendChild(panel);

  /* ─── DRAG ───────────────────────────────────────────────────────── */
  const header = panel.querySelector('#__bkp_header');
  header.addEventListener('mousedown', e => {
    if (['__bkp_close','__bkp_min'].includes(e.target.id)) return;
    isDragging = true;
    const r = panel.getBoundingClientRect();
    dragOffX = e.clientX - r.left; dragOffY = e.clientY - r.top;
    header.style.cursor = 'grabbing';
  });
  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    panel.style.right = 'auto';
    panel.style.left = (e.clientX - dragOffX) + 'px';
    panel.style.top  = (e.clientY - dragOffY) + 'px';
  });
  document.addEventListener('mouseup', () => { isDragging = false; header.style.cursor = 'grab'; });

  /* ─── CLOSE / MIN ────────────────────────────────────────────────── */
  panel.querySelector('#__bkp_close').addEventListener('click', () => panel.remove());
  panel.querySelector('#__bkp_min').addEventListener('click', () => {
    panelVisible = !panelVisible;
    document.getElementById('__bkp_tabs').style.display = panelVisible ? 'flex' : 'none';
    document.getElementById('__bkp_main').style.display = panelVisible ? 'flex' : 'none';
    panel.style.maxHeight = panelVisible ? '620px' : 'auto';
  });

  /* ─── LOG ────────────────────────────────────────────────────────── */
  let logLines = [];
  function addLog(msg, color = '#3b99fc') {
    const time = new Date().toLocaleTimeString('en', { hour12: false, hour:'2-digit', minute:'2-digit', second:'2-digit' });
    logLines.push({ time, msg, color });
    if (logLines.length > 50) logLines.shift();
    refreshMain();
  }

  /* ─── TABS ───────────────────────────────────────────────────────── */
  function renderTabs() {
    const tabBar = document.getElementById('__bkp_tabs');
    if (!tabBar) return;
    tabBar.innerHTML = SCRIPTS.map(s => {
      const isActive = s.id === activeId;
      const isOn = !!injected[s.id];
      const dotColor = isOn ? '#3ddc84' : (s.type === 'console' ? '#c792ea' : '#3b99fc');
      return `
        <div data-tid="${s.id}" style="
          display:flex;align-items:center;gap:6px;
          padding:9px 13px;cursor:pointer;white-space:nowrap;
          border-bottom:2px solid ${isActive ? '#3b99fc' : 'transparent'};
          background:${isActive ? '#2f2f2f' : 'transparent'};
          transition:background 0.1s;flex-shrink:0;
        ">
          <div style="width:6px;height:6px;border-radius:50%;background:${dotColor};flex-shrink:0;transition:background 0.2s;"></div>
          <span style="font-size:12px;color:${isActive ? '#ffffff' : 'rgba(255,255,255,0.4)'};font-weight:${isActive ? '500' : '400'};transition:color 0.1s;">${s.name}</span>
        </div>
      `;
    }).join('');
    tabBar.querySelectorAll('[data-tid]').forEach(el => {
      el.addEventListener('click', () => { activeId = el.dataset.tid; renderTabs(); refreshMain(); });
      el.addEventListener('mouseenter', () => { if (el.dataset.tid !== activeId) el.style.background = '#2a2a2a'; });
      el.addEventListener('mouseleave', () => { if (el.dataset.tid !== activeId) el.style.background = 'transparent'; });
    });
  }

  /* ─── MAIN ───────────────────────────────────────────────────────── */
  function refreshMain() {
    const main = document.getElementById('__bkp_main');
    if (!main) return;
    const s = SCRIPTS.find(x => x.id === activeId);
    if (!s) return;
    const isOn = !!injected[s.id];
    const isConsole = s.type === 'console';

    const typeColor = isConsole ? '#c792ea' : '#3b99fc';
    const typeBg    = isConsole ? 'rgba(199,146,234,0.15)' : 'rgba(59,153,252,0.15)';
    const typeLabel = isConsole ? 'console' : 'inject';

    main.innerHTML = `
      <div style="padding:14px 16px 12px;border-bottom:1px solid #1e1e1e;flex-shrink:0;">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:5px;">
          <span style="font-size:14px;font-weight:600;color:#ffffff;">${s.name}</span>
          <span style="font-size:10px;padding:2px 8px;border-radius:20px;background:${typeBg};color:${typeColor};font-weight:500;">${typeLabel}</span>
          ${s.requiresPanel ? `<span style="font-size:10px;padding:2px 8px;border-radius:20px;background:rgba(254,188,46,0.15);color:#febc2e;font-weight:500;">panel required</span>` : ''}
        </div>
        <div style="font-size:11px;color:rgba(255,255,255,0.35);">by ${s.author} · v${s.version}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.55);margin-top:5px;line-height:1.5;">${s.desc}</div>
      </div>

      <div style="flex:1;overflow-y:auto;padding:12px 16px;min-height:0;scrollbar-width:thin;scrollbar-color:#3b3b3b transparent;">
        ${isConsole ? `
          <div style="font-size:9px;color:rgba(255,255,255,0.2);margin-bottom:8px;letter-spacing:0.8px;font-weight:600;">PREVIEW</div>
          <pre style="font-size:10.5px;color:rgba(255,255,255,0.5);line-height:1.65;white-space:pre-wrap;word-break:break-all;margin:0;background:#1a1a1a;padding:12px;border-radius:6px;border:1px solid #3b3b3b;box-shadow:inset 0 2px 4px rgba(0,0,0,0.3);">${s.code.slice(0,500)}${s.code.length>500?'\n...(truncated)':''}</pre>
        ` : `
          <div style="font-size:9px;color:rgba(255,255,255,0.2);margin-bottom:8px;letter-spacing:0.8px;font-weight:600;">LOG</div>
          <div style="font-size:11px;line-height:1.9;background:#1a1a1a;padding:10px 12px;border-radius:6px;border:1px solid #3b3b3b;min-height:60px;box-shadow:inset 0 2px 4px rgba(0,0,0,0.3);">
            ${logLines.slice(-10).map(l=>`<div><span style="color:rgba(255,255,255,0.2);font-family:monospace;">[${l.time}]</span> <span style="color:${l.color};">${l.msg}</span></div>`).join('') || '<span style="color:rgba(255,255,255,0.2);">No activity yet.</span>'}
          </div>
        `}
      </div>

      <div style="padding:10px 16px;border-top:1px solid #1e1e1e;display:flex;gap:8px;flex-shrink:0;background:#252525;">
        ${isConsole
          ? `<button data-action="run" style="flex:1;padding:9px;background:#3b99fc;color:white;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;font-family:inherit;box-shadow:inset 0 -3px rgba(0,0,0,0.25);transition:filter 0.1s;">Run Script</button>`
          : `<button data-action="${isOn?'stop':'start'}" style="flex:1;padding:9px;background:${isOn?'#e05c5c':'#3b99fc'};color:white;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;font-family:inherit;box-shadow:inset 0 -3px rgba(0,0,0,0.25);transition:filter 0.1s;">${isOn?'Stop':'Inject'}</button>`
        }
      </div>
    `;

    main.querySelectorAll('button[data-action]').forEach(btn => {
      btn.addEventListener('mouseenter', () => btn.style.filter = 'brightness(1.1)');
      btn.addEventListener('mouseleave', () => btn.style.filter = '');
      btn.addEventListener('mousedown', () => btn.style.filter = 'brightness(0.9)');
      btn.addEventListener('mouseup',   () => btn.style.filter = 'brightness(1.1)');
      btn.addEventListener('click', () => handleAction(btn.dataset.action, s));
    });
  }

  /* ─── ACTIONS ────────────────────────────────────────────────────── */
  function handleAction(action, s) {
    if (action === 'start') {
      if (s.run) {
        const result = s.run();
        injected[s.id] = true;
        addLog(`${s.name}: ${result || 'Injected'}`, '#3ddc84');
        renderTabs(); refreshMain();
      }
    } else if (action === 'stop') {
      if (s.stop) {
        const result = s.stop();
        injected[s.id] = false;
        addLog(`${s.name}: ${result || 'Stopped'}`, '#e05c5c');
        renderTabs(); refreshMain();
      }
    } else if (action === 'run') {
      if (s.code) {
        try {
          const fn = new Function(s.code);
          fn();
          addLog(`${s.name}: executed`, '#3ddc84');
        } catch (e) {
          addLog(`${s.name}: ${e.message}`, '#e05c5c');
        }
        refreshMain();
      }
    }
  }

  /* ─── HOTKEY ctrl+shift+b ────────────────────────────────────────── */
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'B')
      panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
  });

  /* ─── INIT ───────────────────────────────────────────────────────── */
  renderTabs();
  refreshMain();
  addLog('Panel ready', '#3b99fc');

})();
