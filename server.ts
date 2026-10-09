import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Increase JSON body limit to support camera and high-res uploaded images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to sanitize base64 image data
function extractBase64Data(imageInput: string): { mimeType: string; data: string } {
  if (imageInput.startsWith('data:')) {
    const matches = imageInput.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      return { mimeType: matches[1], data: matches[2] };
    }
  }
  return { mimeType: 'image/jpeg', data: imageInput.replace(/^data:image\/[a-z]+;base64,/, '') };
}

// Fallback intelligent generator for ADHD task decomposition
function getFallbackDecomposition(roomType: string, energyLevel: string = 'medium') {
  const normRoom = (roomType || 'room').toLowerCase();
  
  if (normRoom.includes('kitchen')) {
    return {
      roomType: 'Kitchen',
      clutterSummary: 'Dishes in/around sink, counters occupied by food packaging and mugs. Perfect candidate for wave-based decompression.',
      overwhelmScore: 7,
      totalEstimatedMinutes: energyLevel === 'low' ? 12 : 18,
      encouragement: 'ADHD Executive Reminder: You do NOT have to deep clean the kitchen today. Finishing Wave 1 already gives you back 40% of your peace of mind.',
      waves: [
        { id: 'wave-1', name: 'Wave 1: Pure Trash (No Decisions)', purpose: 'Removes 30% of visual clutter with zero brain exhaustion' },
        { id: 'wave-2', name: 'Wave 2: Dish Relocation', purpose: 'Consolidates all scattered dishes into the sink zone' },
        { id: 'wave-3', name: 'Wave 3: Clear Island of Peace', purpose: 'Carves out one clean 2-foot sanctuary on the counter' }
      ],
      steps: [
        {
          id: 'step-1',
          waveId: 'wave-1',
          title: 'Trash Dash: Collect only throwaway items',
          instruction: 'Grab a shopping bag or trash can. Pick up ONLY paper towels, wrappers, junk mail, and empty packaging. Leave all dishes alone for now!',
          targetZone: 'Main Countertops',
          estimatedMinutes: 3,
          physicalAnchor: 'Look only for disposable packaging on the main counter',
          dopamineAnchor: 'Instant visual declutter with zero emotional decision-making',
          microReward: 'Take a deep breath and give yourself a mental high five',
          substeps: ['Grab a trash bag', 'Sweep 5 wrappers into the bag', 'Toss empty beverage containers']
        },
        {
          id: 'step-2',
          waveId: 'wave-2',
          title: 'Dish Migration: Stack cups & bowls in sink',
          instruction: 'Do not wash anything yet! Just move stray mugs, bowls, and cutlery into or directly next to the sink basin.',
          targetZone: 'Sink & Counter Island',
          estimatedMinutes: 4,
          physicalAnchor: 'Scan for ceramic mugs and plates on flat surfaces',
          dopamineAnchor: 'Counters suddenly look 60% clearer without doing any washing',
          microReward: 'Stretch your shoulders and drink cold water',
          substeps: ['Pick up cups and mugs first', 'Gather loose silverware into a cup', 'Stack plates neatly near sink']
        },
        {
          id: 'step-3',
          waveId: 'wave-2',
          title: 'Pantry Return: Put 3 food items back',
          instruction: 'Find 3 items that belong in the fridge or pantry (like cereal, condiments, bread) and put them where they sleep.',
          targetZone: 'Prep Counter',
          estimatedMinutes: 3,
          physicalAnchor: 'Spot the cereal box or condiment jars',
          dopamineAnchor: 'Quick win: surfaces instantly open up',
          microReward: 'Roll your neck gently and notice the newfound counter space',
          substeps: ['Put bread or cereal away', 'Put open jars in fridge', 'Close the cupboard doors']
        },
        {
          id: 'step-4',
          waveId: 'wave-3',
          title: 'The 90-Second Wipe: Create a Calm Island',
          instruction: 'Wipe down just a 2-foot section of the counter near the kettle or stove. Make this your designated clean zone.',
          targetZone: 'Front Counter Corner',
          estimatedMinutes: 2,
          physicalAnchor: 'Focus on the clean cloth gliding over the counter surface',
          dopamineAnchor: 'A tactile, shiny clean spot that gives your brain instant satisfaction',
          microReward: 'Admire your Clean Island and pause—you crushed the mission!',
          substeps: ['Dampen a sponge or cloth', 'Wipe down the 2-foot clear zone', 'Rinse cloth']
        }
      ]
    };
  }

  if (normRoom.includes('bed')) {
    return {
      roomType: 'Bedroom',
      clutterSummary: 'Clothes pile on chair/bed, shoes and items on floor, scattered nightstand clutter. Classic executive function freeze zone.',
      overwhelmScore: 8,
      totalEstimatedMinutes: energyLevel === 'low' ? 10 : 16,
      encouragement: 'ADHD Executive Reminder: Messy rooms happen when your brain runs out of spoons. We tackle the floor first so you can walk freely without sensory friction.',
      waves: [
        { id: 'wave-1', name: 'Wave 1: Floor Clearing Path', purpose: 'Removes tripping hazards and opens walking pathways' },
        { id: 'wave-2', name: 'Wave 2: The Clothes Mountain', purpose: 'Sorts clothes into "Clean / Dirty" bins with zero folding pressure' },
        { id: 'wave-3', name: 'Wave 3: Bed Reset', purpose: 'Creates a calming visual centerpiece for restful sleep' }
      ],
      steps: [
        {
          id: 'step-1',
          waveId: 'wave-1',
          title: 'Trash & Dish Evacuation',
          instruction: 'Find any water glasses, mugs, snack packaging, or tissues in the bedroom. Evacuate them outside the room door right now.',
          targetZone: 'Floor & Nightstand',
          estimatedMinutes: 3,
          physicalAnchor: 'Scan only for drink glasses and wrappers',
          dopamineAnchor: 'Immediate hygiene upgrade and removes smells/clutter',
          microReward: 'Sip fresh water and take a long stretch',
          substeps: ['Pick up cups and plates', 'Carry them to hallway or kitchen', 'Throw tissues in wastebasket']
        },
        {
          id: 'step-2',
          waveId: 'wave-2',
          title: 'Basket Toss: All dirty clothes into hamper',
          instruction: 'Do NOT fold anything! Just toss everything on the floor that is obviously dirty into your laundry basket.',
          targetZone: 'Bedroom Floor & Chair',
          estimatedMinutes: 4,
          physicalAnchor: 'Look exclusively at floor textiles and socks',
          dopamineAnchor: 'Floor visibility jumps to 80% in minutes',
          microReward: 'Do a quick victory shimmy on the open floor space',
          substeps: ['Gather socks and shirts from floor', 'Toss into hamper', 'Slide shoes against the wall']
        },
        {
          id: 'step-3',
          waveId: 'wave-2',
          title: 'The "Floordrobe" Chair Decision',
          instruction: 'For clothes on the chair: if wearable again, hang on hooks or drape neatly. If dirty, drop in hamper. No folding required!',
          targetZone: 'Accent Chair or Bed End',
          estimatedMinutes: 3,
          physicalAnchor: 'Pick up 3 items from the clothes chair',
          dopamineAnchor: 'Reclaims a sitting chair that was buried for days',
          microReward: 'Sit down on your cleared chair for 30 seconds',
          substeps: ['Pick up jackets/hoodies', 'Hang on door hooks', 'Drop worn items in basket']
        },
        {
          id: 'step-4',
          waveId: 'wave-3',
          title: 'The 30-Second Blanket Pull',
          instruction: 'Don’t make military hospital corners! Just yank the duvet or blanket straight up toward your pillows and straighten one pillow.',
          targetZone: 'Main Bed',
          estimatedMinutes: 2,
          physicalAnchor: 'Tug the top corners of the duvet',
          dopamineAnchor: 'The bedroom immediately looks 70% calmer and welcoming',
          microReward: 'Pat your smooth bed and feel the dopamine rush',
          substeps: ['Pull blanket to head of bed', 'Fluff pillow once', 'Place book on nightstand']
        }
      ]
    };
  }

  // Generic / Desk / Bathroom default
  return {
    roomType: 'Workspace / Room',
    clutterSummary: 'Desk or room surfaces accumulated items across multiple projects. Our system segments clutter into quick sensory wins.',
    overwhelmScore: 6,
    totalEstimatedMinutes: energyLevel === 'low' ? 9 : 14,
    encouragement: 'ADHD Executive Reminder: Clutter is just delayed decisions. You only need to make simple physical moves right now.',
    waves: [
      { id: 'wave-1', name: 'Wave 1: Rubbish & Relocate', purpose: 'Removes unneeded objects from your immediate eye-line' },
      { id: 'wave-2', name: 'Wave 2: Device & Cord Align', purpose: 'Arranges tools into clean 90-degree lines' },
      { id: 'wave-3', name: 'Wave 3: Clear Working Zone', purpose: 'Creates a focused cockpit for clear thinking' }
    ],
    steps: [
      {
        id: 'step-1',
        waveId: 'wave-1',
        title: 'Clear Old Drinks & Containers',
        instruction: 'Pick up coffee mugs, soda cans, and water bottles. Move them straight to the kitchen sink.',
        targetZone: 'Desktop Left/Right',
        estimatedMinutes: 2,
        physicalAnchor: 'Spot cups and empty bottles near your mousepad',
        dopamineAnchor: 'Frees up immediate desk real estate and eliminates spills risk',
        microReward: 'Take a deep breath and roll your wrists',
        substeps: ['Gather mugs', 'Carry to kitchen', 'Throw away empty beverage can']
      },
      {
        id: 'step-2',
        waveId: 'wave-1',
        title: 'Paper Corral: Stack loose papers into one pile',
        instruction: 'Do NOT read or organize bills/papers now! Simply align them into a single neat stack out of your direct line of sight.',
        targetZone: 'Main Work Surface',
        estimatedMinutes: 3,
        physicalAnchor: 'Gather scattered loose sheets and receipts',
        dopamineAnchor: 'Turns 15 visual distractions into 1 orderly rectangular pile',
        microReward: 'Smile at the instant symmetry',
        substeps: ['Gather papers', 'Tap sides straight', 'Place off to the side']
      },
      {
        id: 'step-3',
        waveId: 'wave-2',
        title: 'Cable Sweep & Peripheral Lineup',
        instruction: 'Tuck charging cables behind the screen edge and align keyboard and mousepad parallel to your desk front.',
        targetZone: 'Center Work Area',
        estimatedMinutes: 3,
        physicalAnchor: 'Look at keyboard angle and charging wires',
        dopamineAnchor: 'Cyberpunk cockpit satisfaction: clean geometry brings mental peace',
        microReward: 'Admire your focused cockpit view',
        substeps: ['Straighten keyboard', 'Tuck loose wires behind monitor', 'Put pens in a holder']
      }
    ]
  };
}

// POST /api/decompose
app.post('/api/decompose', async (req, res) => {
  const { image, roomType, energyLevel = 'medium', customContext = '' } = req.body;

  if (!image) {
    return res.status(400).json({ error: 'Image is required for room clutter decomposition' });
  }

  // Check if GEMINI_API_KEY is present
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    console.warn('GEMINI_API_KEY is not set or placeholder; returning high-fidelity expert decomposition model');
    const fallback = getFallbackDecomposition(roomType || 'kitchen', energyLevel);
    return res.json({ success: true, data: fallback, mode: 'fallback' });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const { mimeType, data: base64Data } = extractBase64Data(image);

    const promptText = `
You are an expert ADHD Executive Function & Decluttering Coach with an encouraging, high-dopamine, non-judgmental approach.
Analyze this photo of a messy room.

ADHD EXECUTIVE FUNCTION CONTEXT:
- People with ADHD experience executive dysfunction and task paralysis when looking at a large messy room because the brain tries to evaluate 100 items at once.
- The antidote is radical TASK DECOMPOSITION: slicing overwhelming chaos into tiny, bite-sized micro-steps (2 to 5 minutes each).
- Rules:
  1. No vague instructions like "clean up the counter". Use micro-actions like "Pick up only disposable plastic wrappers and empty cans".
  2. Sequential Waves: Group into 3-4 structured waves (e.g., Wave 1: Zero-decision trash, Wave 2: Relocate items to their home room, Wave 3: Surface grouping, Wave 4: 90-second wipe).
  3. Physical Anchor: Direct the user's eyes to one specific focal spot so their peripheral vision doesn't get overwhelmed.
  4. Dopamine Anchor: Explain the fast neurological reward (e.g., "Clearing this spot gives your eyes an instant resting sanctuary").
  5. Micro-Reward: A 10-second restorative pause (e.g. stretch, sip water, deep victory breath).
  6. Sub-steps: 3 micro-actions for users in extreme low-energy / freeze mode.
${roomType ? `User indicates this room is a: ${roomType}.` : ''}
${energyLevel === 'low' ? 'User has LOW ENERGY right now: Keep all steps under 3 minutes and prioritize absolute minimum-effort wins.' : ''}
${customContext ? `User special request: "${customContext}".` : ''}

Return a valid JSON object matching this exact schema:
{
  "roomType": "string (e.g. Kitchen, Bedroom, Office Desk, Bathroom)",
  "clutterSummary": "string (compassionate, observant 1-2 sentence description of what is in the room)",
  "overwhelmScore": number (1 to 10),
  "totalEstimatedMinutes": number (sum of micro-step minutes, typically 10-25),
  "encouragement": "string (ADHD-affirming compassionate coaching tip)",
  "waves": [
    {
      "id": "string",
      "name": "string (e.g. Wave 1: Zero-Decision Trash Sweep)",
      "purpose": "string"
    }
  ],
  "steps": [
    {
      "id": "string",
      "waveId": "string (matching wave id)",
      "title": "string (punchy, action-oriented title)",
      "instruction": "string (hyper-specific micro-step instruction)",
      "targetZone": "string (specific area in photo)",
      "estimatedMinutes": number (2 to 5 minutes),
      "physicalAnchor": "string (where to point eyes right now)",
      "dopamineAnchor": "string (instant visual or neurological reward)",
      "microReward": "string (refreshing celebration micro-action)",
      "substeps": ["string", "string", "string"]
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '';
    const parsedData = JSON.parse(responseText.trim());

    return res.json({
      success: true,
      data: parsedData,
      mode: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Error analyzing image with Gemini:', error);
    // Provide graceful fallback so the user is never stuck
    const fallback = getFallbackDecomposition(roomType || 'kitchen', energyLevel);
    return res.json({
      success: true,
      data: fallback,
      mode: 'fallback',
      warning: 'Live vision analysis temporarily unavailable. Showing curated executive function decomposition.',
    });
  }
});

// Endpoint to break down a specific step even smaller ("Make it smaller" for ADHD paralysis)
app.post('/api/subdivide-step', async (req, res) => {
  const { stepTitle, stepInstruction } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return res.json({
      substeps: [
        'Count 3 items in this exact zone',
        'Move just 1 item to its proper spot',
        'Pause and take one deep breath',
        'Move the remaining 2 items',
      ],
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `For someone with severe ADHD paralysis, the task "${stepTitle}" (${stepInstruction}) is still feeling too big. Break it down into 4 ultra-tiny micro-actions (each taking under 30 seconds) that require almost zero executive function. Return a JSON array of strings.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '[]');
    res.json({ substeps: parsed });
  } catch (err) {
    console.error('Error subdividing step:', err);
    res.json({
      substeps: [
        'Look at just ONE item in front of you',
        'Touch that item and move it 6 inches toward its goal',
        'Finish putting that single item away',
        'Smile—you broke through the freeze response!',
      ],
    });
  }
});

// Setup dev server with Vite middlewares or production static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`NEURO//CLEAN server listening on port ${PORT}`);
});
