import{u as E}from"./index-cPuXw7Ke.js";const a={DEFAULT_OPENROUTER_KEY:"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",AI_MODEL:"mistralai/mistral-7b-instruct:free"},g=`
  You are a World-Class Musicologist and Expert in "Liner Notes".
  Your goal is to connect music not just by "Genre", but by the **HUMANS** and **INSTRUMENTS** behind the sound.

  When given a track, you must:
  1. Identify the key personnel (Drummer, Bassist, Pianist, Producer) or defining Instrument (e.g., Fender Rhodes, 808s, specific synth).
  2. Recommend 4 tracks that share these SPECIFIC DNA elements.
     - Example: If playing "Get Lucky", recommend a Chic song because of **Nile Rodgers (Guitar)** or a song with **Omar Hakim (Drums)**.
     - Example: If playing Bill Evans, recommend something with a similar **Piano Trio texture**.
  3. AVOID tracks in the "RECENTLY PLAYED" or "RECENTLY SKIPPED" lists.
`,f={async getRecommendations(s,i=[],c=[]){const{openAIApiKey:m,openRouterApiKey:l}=E.getState(),u=l||m||a.DEFAULT_OPENROUTER_KEY,h=`
      ${g}

      CURRENT TRACK: "${s.title}" by "${s.artist}"
      RECENTLY PLAYED: ${JSON.stringify(i)}
      RECENTLY SKIPPED: ${JSON.stringify(c)}
      
      INSTRUCTIONS:
      1. Think about the Drummers, Pianists, Bassists, or Producers involved.
      2. Suggest 4 songs.
      3. For each, provide a specific "Connection" reason (e.g., "Same Drummer: Steve Gadd", "Similar Rhodes Piano").
      4. Return JSON ONLY: [{ "title": "Song", "artist": "Artist", "reason": "Connection: Same Drummer" }]
    `,p="https://openrouter.ai/api/v1/chat/completions",r={"Content-Type":"application/json",Authorization:`Bearer ${u}`};r["HTTP-Referer"]="https://github.com/biplavbarua/the-archive",r["X-Title"]="The Archive";const d={model:a.AI_MODEL,messages:[{role:"user",content:h}],temperature:.7};try{const e=await fetch(p,{method:"POST",headers:r,body:JSON.stringify(d)});if(!e.ok)throw new Error(`LLM API Error: ${e.status}`);const t=(await e.json()).choices[0].message.content;console.log("🤖 AI Raw Response:",t);let o=t;const n=t.match(/```json\s*([\s\S]*?)\s*```/);n?o=n[1]:o=t.replace(/```json/g,"").replace(/```/g,"").trim();try{return JSON.parse(o)}catch{return console.error("Failed to parse AI JSON:",o),[]}}catch(e){return console.error("AI DJ Error:",e),[]}}};export{f as llmService};
