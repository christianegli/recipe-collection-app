import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Download, Wifi, WifiOff, Star, Clock, Users, Tag, Filter, ChefHat, Sparkles, Camera, Upload, X, Settings, Cloud, CloudDownload } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// PWA Installation prompt
const PWAInstallPrompt = ({ onClose, onInstall }) => (
  <div 
    className="fixed bottom-0 inset-x-0 sm:bottom-4 sm:left-auto sm:right-4 sm:inset-x-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:rounded-xl shadow-lg z-50 sm:max-w-sm"
    style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1rem)' }}
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center">
        <ChefHat className="h-6 w-6 mr-3 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-sm">Install Recipe Collection</h3>
          <p className="text-xs opacity-90 mt-1">Add to your home screen for quick access!</p>
        </div>
      </div>
      <button onClick={onClose} className="text-white/80 hover:text-white ml-2">✕</button>
    </div>
    <button 
      onClick={onInstall}
      className="mt-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium w-full transition-colors"
    >
      Install App
    </button>
  </div>
);

// Sync & Backup Modal
const SyncModal = ({ isOpen, onClose, onExport, onImport, recipeCount }) => {
  const fileInputRef = useRef(null);

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const recipes = JSON.parse(e.target.result);
          onImport(recipes);
        } catch (error) {
          alert('Invalid file format. Please select a valid recipe backup file.');
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-2xl inline-flex mb-4">
            <Cloud className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sync & Backup</h2>
          <p className="text-gray-600">Keep your recipes safe and accessible anywhere</p>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-medium text-blue-900 mb-2">📱 Current Storage</h4>
            <p className="text-sm text-blue-800">
              You have <strong>{recipeCount} recipes</strong> stored locally on this device
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={onExport}
              className="flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-xl hover:from-green-100 hover:to-blue-100 transition-all"
            >
              <Download className="h-6 w-6 text-green-600 mr-3" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Export Recipes</div>
                <div className="text-sm text-gray-600">Download backup file</div>
              </div>
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl hover:from-purple-100 hover:to-blue-100 transition-all"
            >
              <CloudDownload className="h-6 w-6 text-purple-600 mr-3" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Import Recipes</div>
                <div className="text-sm text-gray-600">Upload backup file</div>
              </div>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="text-amber-800 text-sm">
              💡 <strong>Tip:</strong> Export regularly to keep backups. Import the same file on other devices to sync your recipes!
            </p>
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// API Key Setup Modal
const APIKeyModal = ({ isOpen, onClose, onSave, currentKey }) => {
  const [apiKey, setApiKey] = useState(currentKey || '');

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-2xl inline-flex mb-4">
            <Settings className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Gemini API</h2>
          <p className="text-gray-600">Enter your Google Gemini API key to enable recipe extraction</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-medium text-blue-900 mb-2">How to get your API key:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
              <li>2. Create a new API key</li>
              <li>3. Copy and paste it here</li>
            </ol>
            <p className="text-xs text-blue-700 mt-2">💡 Your key is stored locally and never shared</p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg"
            >
              Save API Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Camera component for taking photos
const CameraCapture = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      setIsStreaming(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        onCapture(blob);
        stopCamera();
        onClose();
      }
    }, 'image/jpeg', 0.8);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div 
        className="flex justify-between items-center p-4 text-white"
        style={{ paddingTop: 'max(calc(env(safe-area-inset-top) + 1rem), 1rem)' }}
      >
        <h3 className="text-lg font-semibold">Scan Recipe</h3>
        <button onClick={() => { stopCamera(); onClose(); }} className="text-white/80 hover:text-white">
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="border-2 border-white/50 rounded-lg w-80 h-60 relative">
            <div className="absolute -top-8 left-0 right-0 text-center text-white text-sm">
              Position recipe within frame
            </div>
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-black/50">
        <div className="flex flex-col items-center">
          <button
            onClick={capturePhoto}
            disabled={!isStreaming}
            className="relative bg-white rounded-full w-20 h-20 flex items-center justify-center disabled:opacity-50 transition-transform active:scale-95 shadow-2xl"
            aria-label="Capture photo"
          >
            <div className="absolute inset-1 bg-white rounded-full"></div>
            <div className="absolute inset-2 bg-gray-100 rounded-full border-2 border-gray-300"></div>
            <Camera className="h-8 w-8 text-gray-700 z-10" />
          </button>
          <p className="text-white/90 text-sm text-center mt-4 font-medium">
            Tap to capture recipe
          </p>
          <p className="text-white/60 text-xs text-center mt-1">
            Make sure text is clear and well-lit
          </p>
        </div>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

// Photo upload component
const PhotoUpload = ({ onUpload, onClose }) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      onUpload(file);
      onClose();
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-8">
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-2xl inline-flex mb-4">
            <Upload className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Recipe Photo</h2>
          <p className="text-gray-600">Select a photo of your recipe to extract the details</p>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Drag and drop your photo here, or</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Choose File
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Supports: JPG, PNG, WebP (max 10MB)
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
          className="hidden"
        />

        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Loading skeleton
const RecipeCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-5">
      <div className="h-4 bg-gray-200 rounded mb-3"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
      <div className="flex justify-between mb-3">
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        <div className="h-3 bg-gray-200 rounded w-12"></div>
      </div>
      <div className="flex gap-1 mb-3">
        <div className="h-5 bg-gray-200 rounded-full w-16"></div>
        <div className="h-5 bg-gray-200 rounded-full w-12"></div>
      </div>
      <div className="flex justify-between">
        <div className="h-3 bg-gray-200 rounded w-20"></div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3 w-3 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// IndexedDB utilities
const DB_NAME = 'RecipeDB';
const DB_VERSION = 1;
const STORE_NAME = 'recipes';

class RecipeDB {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('cuisine', 'cuisine', { unique: false });
          store.createIndex('tags', 'tags', { unique: false });
        }
      };
    });
  }

  async addRecipe(recipe) {
    const transaction = this.db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    recipe.id = Date.now().toString();
    recipe.dateAdded = new Date().toISOString();
    recipe.notes = recipe.notes || '';
    return store.add(recipe);
  }

  async updateRecipe(recipe) {
    const transaction = this.db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    recipe.updatedAt = new Date().toISOString();
    return store.put(recipe);
  }

  async getAllRecipes() {
    const transaction = this.db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteRecipe(id) {
    const transaction = this.db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    return store.delete(id);
  }
}

const recipeDB = new RecipeDB();

// Sample recipe data
const sampleRecipes = [
  {
    id: '1',
    name: 'Roasted Aubergine and Onion Salad',
    source: 'Ottolenghi',
    url: 'https://ottolenghi.co.uk/pages/recipes/roasted-aubergine-onion-salad',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    cuisine: 'Middle Eastern',
    tags: ['Vegetarian', 'Healthy', 'Meal Prep'],
    prepTime: '10 min',
    cookTime: '30 min',
    servings: 4,
    difficulty: 'Easy',
    rating: 5,
    ingredients: [
      '2 aubergines (700g), cut into 2½cm rounds',
      '2 onions (280g), cut into 1cm thick rounds',
      '140ml olive oil',
      '1 garlic clove, crushed',
      '1 tbsp red wine vinegar',
      '10g soft herbs (basil, parsley, or mint)',
      '1/2 tsp fine sea salt',
      '1/4 tsp black pepper'
    ],
    instructions: [
      'Preheat oven to 220°C (200°C fan)',
      'Generously brush aubergine and onion rounds with olive oil',
      'Season well with salt and pepper',
      'Roast for 25-30 minutes until soft and golden',
      'Add garlic, vinegar, and herbs while warm',
      'Allow to cool - flavors improve with time'
    ],
    notes: ''
  }
];

// OCR-based recipe extraction using Tesseract.js
const extractRecipeWithOCR = async (imageFile) => {
  try {
    console.log('Starting OCR extraction...');
    
    // Create a Tesseract worker
    const worker = await window.Tesseract.createWorker('eng');
    
    // Process the image
    const result = await worker.recognize(imageFile);
    const extractedText = result.data.text;
    
    console.log('OCR text extracted:', extractedText.substring(0, 200) + '...');
    
    // Terminate the worker
    await worker.terminate();
    
    // Parse the text to extract recipe information
    const recipe = parseRecipeFromText(extractedText);
    
    return recipe;
  } catch (error) {
    console.error('OCR extraction error:', error);
    throw new Error('Failed to extract text from image. Please ensure the image has clear, readable text.');
  }
};

// Parse recipe information from plain text
const parseRecipeFromText = (text) => {
  const lines = text.split('\n').filter(line => line.trim());
  
  // Find recipe name (usually first non-empty line or after "Recipe:" marker)
  let name = 'Untitled Recipe';
  const nameMatch = text.match(/recipe[:\s]+([^\n]+)/i);
  if (nameMatch) {
    name = nameMatch[1].trim();
  } else if (lines.length > 0) {
    name = lines[0].trim();
  }
  
  // Extract ingredients (look for bullet points, numbers, or ingredient-like patterns)
  const ingredients = [];
  const ingredientSection = text.match(/ingredients[:\s]*([^]*?)(?:instructions|directions|method|steps|$)/i);
  if (ingredientSection) {
    const ingredientLines = ingredientSection[1].split('\n');
    ingredientLines.forEach(line => {
      const cleaned = line.trim();
      if (cleaned && (
        cleaned.match(/^\d+|^•|^-|^\*/) || // Starts with number or bullet
        cleaned.match(/\d+\s*(cup|tbsp|tsp|oz|lb|g|kg|ml|l)/i) // Contains measurements
      )) {
        ingredients.push(cleaned.replace(/^[•\-\*]\s*/, ''));
      }
    });
  }
  
  // Extract instructions
  const instructions = [];
  const instructionSection = text.match(/(?:instructions|directions|method|steps)[:\s]*([^]*?)$/i);
  if (instructionSection) {
    const instructionLines = instructionSection[1].split('\n');
    instructionLines.forEach(line => {
      const cleaned = line.trim();
      if (cleaned && cleaned.length > 10) {
        instructions.push(cleaned.replace(/^\d+[\.\)]\s*/, ''));
      }
    });
  }
  
  // Extract other metadata
  const servingsMatch = text.match(/(?:serves?|servings?)[:\s]*(\d+)/i);
  const servings = servingsMatch ? parseInt(servingsMatch[1]) : 4;
  
  const prepTimeMatch = text.match(/prep(?:aration)?\s*time[:\s]*(\d+)\s*(min|hour)/i);
  const prepTime = prepTimeMatch ? `${prepTimeMatch[1]} ${prepTimeMatch[2]}` : '15 min';
  
  const cookTimeMatch = text.match(/cook(?:ing)?\s*time[:\s]*(\d+)\s*(min|hour)/i);
  const cookTime = cookTimeMatch ? `${cookTimeMatch[1]} ${cookTimeMatch[2]}` : '30 min';
  
  return {
    id: Date.now(),
    name: name,
    cuisine: 'Other',
    prepTime: prepTime,
    cookTime: cookTime,
    servings: servings,
    difficulty: 'Medium',
    rating: 0,
    tags: [],
    ingredients: ingredients.length > 0 ? ingredients : ['Unable to extract ingredients from image'],
    instructions: instructions.length > 0 ? instructions : ['Unable to extract instructions from image'],
    notes: 'Extracted via OCR - please review and edit as needed',
    source: 'OCR Scan',
    extractionMethod: 'ocr',
    updatedAt: new Date().toISOString()
  };
};

// Client-side Gemini API integration
const extractRecipeWithGemini = async (content, apiKey, isImage = false) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-pro-vision for images, gemini-1.5-flash for text
    const modelName = isImage ? "gemini-1.5-flash" : "gemini-1.5-flash";
    console.log('Using model:', modelName, 'for', isImage ? 'image' : 'text', 'processing');
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `Extract recipe information from the provided content and return ONLY a JSON object with this exact structure:

{
  "name": "Recipe name",
  "cuisine": "Italian|Asian|Mediterranean|Mexican|French|American|Indian|Other",
  "prepTime": "X min",
  "cookTime": "X min", 
  "servings": number,
  "difficulty": "Easy|Medium|Hard",
  "tags": ["tag1", "tag2"],
  "ingredients": ["ingredient 1", "ingredient 2"],
  "instructions": ["step 1", "step 2"],
  "source": "${isImage ? 'Photo Upload' : 'Website'}",
  "url": ""
}

CRITICAL REQUIREMENTS:
- Copy ingredients EXACTLY as written, including all measurements, brands, and parenthetical notes
- Copy instructions EXACTLY as written, preserving the original wording
- Do NOT paraphrase, summarize, or modify the text
- Include ALL ingredients listed, even if they seem optional
- Include ALL instruction steps in their original order
- For prep/cook time: look for exact times mentioned in the recipe
- For servings: use the exact number from the recipe
- Return ONLY valid JSON, no explanations before or after
- If a field is not found, use reasonable defaults: prepTime "15 min", cookTime "30 min", servings 4`;

    let result;
    if (isImage) {
      // Convert blob to base64 for image processing
      console.log('Converting image to base64...');
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result.split(',')[1];
          console.log('Base64 conversion complete, length:', base64String.length);
          resolve(base64String);
        };
        reader.readAsDataURL(content);
      });

      const imagePart = {
        inlineData: {
          data: base64,
          mimeType: content.type || 'image/jpeg'
        }
      };

      console.log('Calling Gemini API with image...');
      result = await model.generateContent([prompt, imagePart]);
    } else {
      result = await model.generateContent(prompt + "\n\nContent:\n" + content);
    }

    const response = await result.response;
    const text = response.text();
    
    console.log('Gemini response received, parsing JSON...');
    
    // Clean and parse JSON
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsedRecipe = JSON.parse(cleanedText);
    
    console.log('Successfully parsed recipe:', parsedRecipe.name);
    return parsedRecipe;
    
  } catch (error) {
    console.error('Gemini API error:', error);
    console.error('Full error details:', {
      message: error.message,
      code: error.code,
      status: error.status,
      statusText: error.statusText
    });
    
    // Pass through the original error for better error handling
    throw error;
  }
};

// Fetch webpage content using multiple CORS proxy fallbacks
const fetchWebpageContent = async (url) => {
  // Detect iOS Safari
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  
  // List of CORS proxies to try in order - prioritize iOS-friendly ones first
  const proxies = isIOS || isSafari ? [
    `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
    `https://proxy.cors.sh/${url}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    `https://thingproxy.freeboard.io/fetch/${url}`
  ] : [
    `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    `https://cors-anywhere.herokuapp.com/${url}`,
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
    `https://thingproxy.freeboard.io/fetch/${url}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
  ];

  let lastError;
  
  // For iOS, try a direct fetch first (sometimes works for same-origin or CORS-enabled sites)
  if (isIOS || isSafari) {
    try {
      console.log('iOS detected: Trying direct fetch first...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(url, {
        signal: controller.signal,
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'omit'
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const content = await response.text();
        console.log('Direct fetch successful!');
        return content;
      }
    } catch (error) {
      console.log('Direct fetch failed, trying proxies...', error.message);
    }
  }
  
  for (let i = 0; i < proxies.length; i++) {
    try {
      console.log(`Trying proxy ${i + 1}/${proxies.length}: ${proxies[i].split('/')[2]}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), isIOS ? 20000 : 15000); // Longer timeout for iOS
      
      // iOS Safari specific headers and options
      const fetchOptions = {
        signal: controller.signal,
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'omit',
        headers: {
          'Accept': 'application/json, text/html, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      };
      
      // Add user agent for non-iOS devices (iOS Safari doesn't allow custom user-agent)
      if (!isIOS) {
        fetchOptions.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1';
      }
      
      const response = await fetch(proxies[i], fetchOptions);
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        // Handle different proxy response formats
        if (data.contents) {
          return data.contents; // allorigins format
        } else if (data.content) {
          return data.content; // codetabs format
        } else if (typeof data === 'string') {
          return data;
        } else {
          return JSON.stringify(data);
        }
      } else {
        // Direct text response (cors-anywhere, thingproxy)
        return await response.text();
      }
      
    } catch (error) {
      lastError = error;
      console.warn(`Proxy ${i + 1} failed:`, error.message);
      
      // If this was the last proxy, we'll throw the error
      if (i === proxies.length - 1) {
        break;
      }
      
      // Wait a bit before trying the next proxy
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // If all proxies failed, throw a user-friendly error
  const errorMessage = isIOS || isSafari 
    ? 'iPhone Safari has strict security restrictions that prevent URL extraction.\n\n' +
      '📱 Recommended solutions:\n' +
      '• Use the photo scanning feature (works perfectly!)\n' +
      '• Copy the recipe text and scan it as a photo\n' +
      '• Try opening in Chrome app if available\n\n' +
      '💡 Photo scanning is actually more accurate and works offline!'
    : 'Unable to access the website. This might be due to:\n' +
      '• Mobile network restrictions\n' +
      '• Website blocking automated access\n' +
      '• Connectivity issues\n\n' +
      'Try using the photo scanning feature instead!';
      
  throw new Error(errorMessage);
};

// Parse ISO 8601 duration to human readable format
const parseISO8601Duration = (duration) => {
  if (!duration) return null;
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return null;
  
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  
  if (hours && minutes) {
    return `${hours} hr ${minutes} min`;
  } else if (hours) {
    return `${hours} hr`;
  } else if (minutes) {
    return `${minutes} min`;
  }
  return null;
};

// Ingredient scaling utility
const scaleIngredient = (ingredient, originalServings, newServings) => {
  const multiplier = newServings / originalServings;
  const numberRegex = /(\d+(?:\.\d+)?(?:\/\d+)?)/g;
  
  return ingredient.replace(numberRegex, (match) => {
    let number = parseFloat(match);
    if (match.includes('/')) {
      const [num, den] = match.split('/');
      number = parseFloat(num) / parseFloat(den);
    }
    
    const scaled = number * multiplier;
    
    if (scaled < 1 && scaled > 0) {
      if (scaled === 0.5) return '1/2';
      if (scaled === 0.25) return '1/4';
      if (scaled === 0.75) return '3/4';
      if (scaled === 0.33) return '1/3';
      if (scaled === 0.67) return '2/3';
      return scaled.toFixed(2);
    } else if (scaled % 1 === 0) {
      return scaled.toString();
    } else {
      return scaled.toFixed(1);
    }
  });
};

export default function RecipeApp() {
  const [recipes, setRecipes] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecipeUrl, setNewRecipeUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [currentServings, setCurrentServings] = useState(4);
  const [showFilters, setShowFilters] = useState(false);
  const [showPWAPrompt, setShowPWAPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [extractionMethod, setExtractionMethod] = useState('url');
  const [showAPIKeyModal, setShowAPIKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');
  const [filters, setFilters] = useState({
    cuisine: '',
    difficulty: '',
    tags: [],
    maxCookTime: ''
  });

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // PWA Installation detection
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         window.navigator.standalone === true;
    
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      
      // Only show our custom prompt if not already installed and not dismissed
      if (!isStandalone && !localStorage.getItem('pwa-prompt-dismissed')) {
        const timer = setTimeout(() => setShowPWAPrompt(true), 3000);
        return () => clearTimeout(timer);
      }
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Show prompt for standalone detection (for already visitied users)
    if (!isStandalone && !localStorage.getItem('pwa-prompt-dismissed') && !deferredPrompt) {
      const timer = setTimeout(() => setShowPWAPrompt(true), 3000);
      return () => clearTimeout(timer);
    }
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [deferredPrompt]);

  const dismissPWAPrompt = () => {
    setShowPWAPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  const handlePWAInstall = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // Clear the deferredPrompt variable, since it can only be used once
      setDeferredPrompt(null);
      setShowPWAPrompt(false);
    } else {
      // Fallback for browsers that don't support beforeinstallprompt
      // or when the prompt is not available (like iOS Safari)
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      if (isIOS) {
        alert('To install this app on iOS:\n1. Tap the Share button\n2. Select "Add to Home Screen"');
      } else if (isAndroid) {
        alert('To install this app:\n1. Tap the menu (⋮) in your browser\n2. Select "Add to Home screen"');
      } else {
        alert('To install this app, look for the "Install" option in your browser menu or address bar.');
      }
      
      setShowPWAPrompt(false);
    }
  };

  // Export recipes to JSON file
  const exportRecipes = async () => {
    try {
      const allRecipes = await recipeDB.getAllRecipes();
      const exportData = {
        recipes: allRecipes,
        exportDate: new Date().toISOString(),
        version: "1.0"
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `recipes-backup-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      setShowSyncModal(false);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export recipes. Please try again.');
    }
  };

  // Import recipes from JSON file
  const importRecipes = async (importData) => {
    try {
      let recipes;
      
      // Handle different import formats
      if (importData.recipes && Array.isArray(importData.recipes)) {
        recipes = importData.recipes;
      } else if (Array.isArray(importData)) {
        recipes = importData;
      } else {
        throw new Error('Invalid format');
      }

      if (recipes.length === 0) {
        alert('No recipes found in the import file.');
        return;
      }

      // Ask user if they want to merge or replace
      const currentCount = await recipeDB.getAllRecipes();
      const merge = window.confirm(
        `Found ${recipes.length} recipes to import.\n\n` +
        `Click OK to MERGE with your existing ${currentCount.length} recipes.\n` +
        `Click Cancel to REPLACE all your current recipes.`
      );

      if (!merge) {
        // Clear existing recipes
        const existingRecipes = await recipeDB.getAllRecipes();
        for (const recipe of existingRecipes) {
          await recipeDB.deleteRecipe(recipe.id);
        }
      }

      // Import new recipes
      let imported = 0;
      for (const recipe of recipes) {
        try {
          // Generate new ID to avoid conflicts
          const newRecipe = { ...recipe };
          delete newRecipe.id; // Let the database generate a new ID
          await recipeDB.addRecipe(newRecipe);
          imported++;
        } catch (error) {
          console.warn('Failed to import recipe:', recipe.name, error);
        }
      }

      // Refresh the recipes list
      const updatedRecipes = await recipeDB.getAllRecipes();
      setRecipes(updatedRecipes);
      
      setShowSyncModal(false);
      alert(`Successfully imported ${imported} recipes!`);
      
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import recipes. Please check the file format and try again.');
    }
  };

  // Simple local recipe operations
  const addRecipe = async (recipe) => {
    const recipeWithTimestamp = {
      ...recipe,
      updatedAt: new Date().toISOString()
    };
    
    await recipeDB.addRecipe(recipeWithTimestamp);
    const updatedRecipes = await recipeDB.getAllRecipes();
    setRecipes(updatedRecipes);
  };

  const deleteRecipeLocal = async (recipeId) => {
    await recipeDB.deleteRecipe(recipeId);
    const updatedRecipes = await recipeDB.getAllRecipes();
    setRecipes(updatedRecipes);
  };

  // Initialize database and load recipes
  useEffect(() => {
    async function initApp() {
      setIsLoading(true);
      try {
        await recipeDB.init();
        const savedRecipes = await recipeDB.getAllRecipes();
        if (savedRecipes.length === 0) {
          for (const recipe of sampleRecipes) {
            await recipeDB.addRecipe(recipe);
          }
          setRecipes(sampleRecipes);
        } else {
          setRecipes(savedRecipes);
        }
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setRecipes(sampleRecipes);
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    }
    initApp();
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Filter recipes
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCuisine = !filters.cuisine || recipe.cuisine === filters.cuisine;
    const matchesDifficulty = !filters.difficulty || recipe.difficulty === filters.difficulty;
    const matchesTags = filters.tags.length === 0 || 
                       filters.tags.some(tag => recipe.tags.includes(tag));
    
    let matchesCookTime = true;
    if (filters.maxCookTime) {
      const recipeTime = parseInt(recipe.cookTime);
      const maxTime = parseInt(filters.maxCookTime);
      matchesCookTime = recipeTime <= maxTime;
    }
    
    return matchesSearch && matchesCuisine && matchesDifficulty && matchesTags && matchesCookTime;
  });

  // Get unique values for filter options
  const cuisineOptions = [...new Set(recipes.map(r => r.cuisine))];
  const difficultyOptions = ['Easy', 'Medium', 'Hard'];
  const allTags = [...new Set(recipes.flatMap(r => r.tags))];

  // Update serving size when recipe is selected
  useEffect(() => {
    if (selectedRecipe) {
      setCurrentServings(selectedRecipe.servings);
    }
  }, [selectedRecipe]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleTagFilter = (tag) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const clearFilters = () => {
    setFilters({
      cuisine: '',
      difficulty: '',
      tags: [],
      maxCookTime: ''
    });
  };

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('gemini-api-key', key);
  };

  const extractRecipeFromPhoto = async (photoFile) => {
    setIsExtracting(true);
    
    try {
      let extractedRecipe;
      
      // Try Gemini API first if API key is available
      if (apiKey && isOnline) {
        try {
          console.log('Attempting Gemini extraction...');
          extractedRecipe = await extractRecipeWithGemini(photoFile, apiKey, true);
          console.log('Successfully extracted recipe with Gemini:', extractedRecipe.name);
        } catch (geminiError) {
          console.error('Gemini extraction failed:', geminiError);
          
          // Ask user if they want to try OCR instead
          const useOCR = window.confirm(
            'AI extraction failed. Would you like to try text recognition (OCR) instead?\n\n' +
            'OCR works offline but may be less accurate for complex recipes.'
          );
          
          if (useOCR) {
            console.log('Falling back to OCR extraction...');
            extractedRecipe = await extractRecipeWithOCR(photoFile);
            console.log('Successfully extracted recipe with OCR:', extractedRecipe.name);
          } else {
            throw geminiError;
          }
        }
      } else {
        // No API key or offline - use OCR directly
        console.log('Using OCR extraction (no API key or offline)...');
        extractedRecipe = await extractRecipeWithOCR(photoFile);
        console.log('Successfully extracted recipe with OCR:', extractedRecipe.name);
      }
      
      // Add placeholder image (in a real app, you might store the photo)
      extractedRecipe.image = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000) + 1500000000000}-${Math.floor(Math.random() * 1000000) + 100000}?w=600&h=400&fit=crop&auto=format&q=80`;
      extractedRecipe.extractionMethod = 'photo';
      
      await addRecipe(extractedRecipe);
      setShowAddModal(false);
      
      console.log('Successfully extracted recipe from photo:', extractedRecipe.name);
      
    } catch (error) {
      console.error('Failed to extract recipe from photo:', error);
      console.error('Error details:', error.message, error.stack);
      
      let errorMessage = 'Failed to extract recipe from photo. ';
      if (error.message && (error.message.includes('API key') || error.message.includes('API_KEY_INVALID'))) {
        errorMessage += 'Please check your API key in settings.';
        setShowAPIKeyModal(true);
      } else if (error.message && error.message.includes('PERMISSION_DENIED')) {
        errorMessage += 'The API key does not have permission to use Gemini Vision. Please check your API key settings.';
        setShowAPIKeyModal(true);
      } else if (error.message && error.message.includes('SAFETY')) {
        errorMessage += 'The image was blocked by safety filters. Please try a different photo.';
      } else {
        errorMessage += 'Make sure the recipe text is clear and readable in the photo. Error: ' + (error.message || 'Unknown error');
      }
      
      alert(errorMessage);
    } finally {
      setIsExtracting(false);
    }
  };

  const extractRecipe = async (url) => {
    if (!isOnline) {
      alert('Recipe extraction requires internet connection');
      return;
    }

    if (!apiKey) {
      setShowAPIKeyModal(true);
      return;
    }
    
    setIsExtracting(true);
    try {
      // Fetch webpage content
      const htmlContent = await fetchWebpageContent(url);
      
      // First, try to extract structured data if available
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      let structuredRecipe = null;
      
      // Look for JSON-LD structured data
      const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
      for (const script of jsonLdScripts) {
        try {
          const data = JSON.parse(script.textContent);
          if (data['@type'] === 'Recipe' || (Array.isArray(data) && data.some(item => item['@type'] === 'Recipe'))) {
            structuredRecipe = Array.isArray(data) ? data.find(item => item['@type'] === 'Recipe') : data;
            break;
          }
        } catch (e) {
          // Continue to next script
        }
      }
      
      // If we found structured data, use it to enhance our extraction
      let enhancedContent = htmlContent;
      if (structuredRecipe) {
        enhancedContent = `
STRUCTURED RECIPE DATA FOUND:
Name: ${structuredRecipe.name || ''}
Prep Time: ${parseISO8601Duration(structuredRecipe.prepTime) || structuredRecipe.prepTime || ''}
Cook Time: ${parseISO8601Duration(structuredRecipe.cookTime) || structuredRecipe.cookTime || ''}
Total Time: ${parseISO8601Duration(structuredRecipe.totalTime) || structuredRecipe.totalTime || ''}
Yield: ${structuredRecipe.recipeYield || ''}
Ingredients (COPY EXACTLY AS LISTED):
${structuredRecipe.recipeIngredient ? structuredRecipe.recipeIngredient.join('\n') : ''}

Instructions (COPY EXACTLY AS LISTED):
${structuredRecipe.recipeInstructions ? 
  (Array.isArray(structuredRecipe.recipeInstructions) ? 
    structuredRecipe.recipeInstructions.map((inst, index) => {
      const text = typeof inst === 'string' ? inst : (inst.text || inst.name || '');
      return `${index + 1}. ${text}`;
    }).join('\n') : structuredRecipe.recipeInstructions) : ''}

FULL HTML CONTENT FOR ADDITIONAL DETAILS:
${htmlContent}`;
      }
      
      // Extract recipe using Gemini with enhanced content
      const extractedRecipe = await extractRecipeWithGemini(enhancedContent, apiKey, false);
      extractedRecipe.url = url;
      extractedRecipe.extractionMethod = 'url';
      
      // Enhanced image extraction - try multiple methods
      
      let recipeImage = null;
      
      // 1. Try Open Graph image (most reliable)
      const ogImage = doc.querySelector('meta[property="og:image"]');
      if (ogImage && ogImage.getAttribute('content')) {
        recipeImage = ogImage.getAttribute('content');
      }
      
      // 2. Try structured data (schema.org)
      if (!recipeImage) {
        const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
        for (const script of jsonLdScripts) {
          try {
            const data = JSON.parse(script.textContent);
            if (data['@type'] === 'Recipe' && data.image) {
              recipeImage = Array.isArray(data.image) ? data.image[0] : data.image;
              if (typeof recipeImage === 'object' && recipeImage.url) {
                recipeImage = recipeImage.url;
              }
              break;
            }
          } catch (e) {
            // Continue to next script
          }
        }
      }
      
      // 3. Try Twitter card image
      if (!recipeImage) {
        const twitterImage = doc.querySelector('meta[name="twitter:image"]');
        if (twitterImage && twitterImage.getAttribute('content')) {
          recipeImage = twitterImage.getAttribute('content');
        }
      }
      
      // 4. Try to find recipe-specific image in content
      if (!recipeImage) {
        // Look for images within recipe containers
        const recipeSelectors = [
          '.recipe-image img',
          '.recipe-photo img',
          '.recipe-header img',
          'article img',
          '.entry-content img',
          'main img'
        ];
        
        for (const selector of recipeSelectors) {
          const img = doc.querySelector(selector);
          if (img && img.src && !img.src.includes('logo') && !img.src.includes('icon')) {
            recipeImage = img.src;
            break;
          }
        }
      }
      
      // Make sure image URL is absolute
      if (recipeImage && !recipeImage.startsWith('http')) {
        try {
          const baseUrl = new URL(url);
          recipeImage = new URL(recipeImage, baseUrl).href;
        } catch (e) {
          recipeImage = null;
        }
      }
      
      extractedRecipe.image = recipeImage || `https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=600&h=400&fit=crop&auto=format&q=80`;
      
      await addRecipe(extractedRecipe);
      setShowAddModal(false);
      setNewRecipeUrl('');
      
      console.log('Successfully extracted recipe:', extractedRecipe.name);
      
    } catch (error) {
      console.error('Failed to extract recipe:', error);
      
      let errorMessage = 'Failed to extract recipe.\n\n';
      
      if (error.message.includes('API key')) {
        errorMessage += 'Please check your API key in settings.';
        setShowAPIKeyModal(true);
      } else if (error.message.includes('Unable to access the website')) {
        // This is our custom mobile-friendly error message
        errorMessage = error.message;
      } else if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('Failed to fetch')) {
        errorMessage += 'Network connectivity issue:\n\n' +
                      '📱 On mobile, try:\n' +
                      '• Switching between WiFi and cellular\n' +
                      '• Using the photo scanning feature instead\n' +
                      '• Trying again in a few minutes\n\n' +
                      '💡 Photo scanning works 100% offline!';
      } else if (error.message.includes('timeout') || error.message.includes('abort')) {
        errorMessage += 'The website took too long to respond.\n\n' +
                      'Try using the photo scanning feature for instant results!';
      } else {
        errorMessage += 'Please try again or use photo scanning.\n\n' +
                      'Photo scanning is more reliable and works offline!';
      }
      
      alert(errorMessage);
    } finally {
      setIsExtracting(false);
    }
  };

  const deleteRecipe = async (id) => {
    try {
      await deleteRecipeLocal(id);
      setSelectedRecipe(null);
    } catch (error) {
      console.error('Failed to delete recipe:', error);
    }
  };

  const updateRecipeRating = async (recipeId, newRating) => {
    try {
      const updatedRecipes = recipes.map(recipe => 
        recipe.id === recipeId ? { ...recipe, rating: newRating } : recipe
      );
      setRecipes(updatedRecipes);
      
      if (selectedRecipe && selectedRecipe.id === recipeId) {
        setSelectedRecipe({ ...selectedRecipe, rating: newRating });
      }
    } catch (error) {
      console.error('Failed to update rating:', error);
    }
  };

  const updateRecipeNotes = async (recipeId, newNotes) => {
    try {
      const recipeToUpdate = recipes.find(r => r.id === recipeId);
      if (recipeToUpdate) {
        const updatedRecipe = { ...recipeToUpdate, notes: newNotes };
        await recipeDB.updateRecipe(updatedRecipe);
        
        const updatedRecipes = recipes.map(recipe => 
          recipe.id === recipeId ? updatedRecipe : recipe
        );
        setRecipes(updatedRecipes);
        
        if (selectedRecipe && selectedRecipe.id === recipeId) {
          setSelectedRecipe(updatedRecipe);
        }
      }
    } catch (error) {
      console.error('Failed to update notes:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header 
        className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-40"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 0px)' }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center min-w-0">
              <div className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl mr-2 sm:mr-3 flex-shrink-0">
                <ChefHat className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent truncate">
                  Recipe Collection
                </h1>
                <div className="hidden sm:flex items-center text-xs text-gray-500">
                  {isOnline ? (
                    <>
                      <Wifi className="h-3 w-3 text-green-500 mr-1" />
                      <span>Online & Ready</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3 w-3 text-amber-500 mr-1" />
                      <span>Offline Mode</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-3">
              <button
                onClick={() => setShowSyncModal(true)}
                className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all bg-blue-100 text-blue-600 hover:bg-blue-200"
                title="Sync & Backup Recipes"
              >
                <Cloud className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowAPIKeyModal(true)}
                className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all ${
                  apiKey 
                    ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                }`}
                title={apiKey ? 'API Key Configured' : 'Setup API Key'}
              >
                <Settings className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`relative p-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-200 flex items-center ${
                  showFilters 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white/60 hover:bg-white/80 text-gray-700 border border-gray-200/50'
                }`}
              >
                <Filter className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Filters</span>
                {(filters.cuisine || filters.difficulty || filters.tags.length > 0 || filters.maxCookTime) && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-bold">
                    {[filters.cuisine, filters.difficulty, ...filters.tags, filters.maxCookTime].filter(Boolean).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-1.5 sm:px-6 sm:py-2 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Add Recipe</span>
                <span className="hidden sm:inline ml-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">📷 AI</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-6 sm:items-center">
              <div className="flex items-center space-x-3">
                <label className="text-sm font-semibold text-gray-700">Cuisine:</label>
                <select
                  value={filters.cuisine}
                  onChange={(e) => updateFilter('cuisine', e.target.value)}
                  className="bg-white/80 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                >
                  <option value="">All Cuisines</option>
                  {cuisineOptions.map(cuisine => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <label className="text-sm font-semibold text-gray-700">Difficulty:</label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => updateFilter('difficulty', e.target.value)}
                  className="bg-white/80 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                >
                  <option value="">All Levels</option>
                  {difficultyOptions.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <label className="text-sm font-semibold text-gray-700">Cook Time:</label>
                <select
                  value={filters.maxCookTime}
                  onChange={(e) => updateFilter('maxCookTime', e.target.value)}
                  className="bg-white/80 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                >
                  <option value="">Any Duration</option>
                  <option value="15">Under 15 min</option>
                  <option value="30">Under 30 min</option>
                  <option value="60">Under 1 hour</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 flex-1">
                <label className="text-sm font-semibold text-gray-700">Tags:</label>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 8).map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTagFilter(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                        filters.tags.includes(tag)
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                          : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {(filters.cuisine || filters.difficulty || filters.tags.length > 0 || filters.maxCookTime) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-800 underline font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-10 sm:pr-4 py-3 sm:py-4 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl shadow-lg focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 text-base sm:text-lg placeholder-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-12">
        {filteredRecipes.length > 0 && !isLoading && (
          <div className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600 px-1">
            Showing {filteredRecipes.length} of {recipes.length} recipes
          </div>
        )}
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {isLoading ? (
            [...Array(8)].map((_, index) => (
              <RecipeCardSkeleton key={index} />
            ))
          ) : (
            filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className="bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden hover:scale-105"
              >
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-32 sm:h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=400&h=300&fit=crop&auto=format';
                    }}
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-sm sm:text-lg text-gray-900 mb-1 sm:mb-2 line-clamp-2">
                    {recipe.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 flex items-center truncate">
                    {recipe.source}
                    {recipe.extractionMethod === 'photo' && (
                      <span className="ml-1 sm:ml-2 bg-purple-100 text-purple-700 px-1.5 sm:px-2 py-0.5 rounded-full text-xs">📷</span>
                    )}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {recipe.cookTime}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {recipe.servings}
                    </div>
                  </div>

                  <div className="hidden sm:flex flex-wrap gap-1 mb-3">
                    {recipe.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-900">{recipe.cuisine}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 sm:h-4 sm:w-4 ${
                            i < recipe.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {filteredRecipes.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full inline-flex mb-4">
              <Search className="h-8 w-8" />
            </div>
            <p className="text-gray-500 text-lg">No recipes found</p>
            <p className="text-gray-400">Try adjusting your search or add a new recipe</p>
          </div>
        )}
      </div>

      {/* Add Recipe Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl max-w-md w-full p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-2xl inline-flex mb-4">
                <Plus className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Recipe</h2>
              <p className="text-gray-600">Extract recipes from URLs or scan photos with AI</p>
            </div>

            {/* Method Selection */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                onClick={() => setExtractionMethod('url')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                  extractionMethod === 'url'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🔗 From URL
              </button>
              <button
                onClick={() => setExtractionMethod('photo')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                  extractionMethod === 'photo'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📷 From Photo
              </button>
            </div>
            
            {/* URL Method */}
            {extractionMethod === 'url' && (
              <div className="space-y-4">
                <input
                  type="url"
                  placeholder="https://example.com/recipe"
                  value={newRecipeUrl}
                  onChange={(e) => setNewRecipeUrl(e.target.value)}
                  className="w-full p-4 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-center"
                />
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => extractRecipe(newRecipeUrl)}
                    disabled={!newRecipeUrl || isExtracting || !isOnline}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg"
                  >
                    {isExtracting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        <span className="text-xs">Extracting...</span>
                      </div>
                    ) : (
                      'Extract Recipe'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Photo Method */}
            {extractionMethod === 'photo' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setShowCamera(true);
                    }}
                    className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-all"
                  >
                    <Camera className="h-8 w-8 text-blue-600 mb-2" />
                    <span className="font-medium text-gray-900">Take Photo</span>
                    <span className="text-xs text-gray-500 mt-1">Use camera</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setShowPhotoUpload(true);
                    }}
                    className="flex flex-col items-center p-6 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-xl hover:from-green-100 hover:to-blue-100 transition-all"
                  >
                    <Upload className="h-8 w-8 text-green-600 mb-2" />
                    <span className="font-medium text-gray-900">Upload Photo</span>
                    <span className="text-xs text-gray-500 mt-1">From gallery</span>
                  </button>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800 text-center">
                    <strong>AI + OCR Support:</strong> If AI extraction fails, you can use text recognition (OCR) which works offline!
                  </p>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <p className="text-blue-800 text-sm text-center">
                    🤖 <strong>AI-Powered:</strong> Make sure recipe text is clear and well-lit
                  </p>
                </div>
              </div>
            )}
            
            {!isOnline && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-4">
                <p className="text-amber-800 text-sm font-medium text-center">
                  ⚠️ Internet connection required for AI extraction
                </p>
              </div>
            )}

            {!apiKey && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mt-4">
                <p className="text-red-800 text-sm font-medium text-center">
                  🔑 Gemini API key required - click settings to configure
                </p>
              </div>
            )}

            {extractionMethod === 'url' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-4">
                <p className="text-blue-800 text-sm text-center">
                  {/iPad|iPhone|iPod/.test(navigator.userAgent) 
                    ? '🍎 iPhone users: URL extraction has limited success due to Safari security. Photo scanning works perfectly!'
                    : '📱 Mobile tip: URL extraction may be limited on mobile networks. Photo scanning is more reliable!'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Camera Component */}
      {showCamera && (
        <CameraCapture
          onCapture={extractRecipeFromPhoto}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Photo Upload Component */}
      {showPhotoUpload && (
        <PhotoUpload
          onUpload={extractRecipeFromPhoto}
          onClose={() => setShowPhotoUpload(false)}
        />
      )}

      {/* Sync Modal */}
      <SyncModal
        isOpen={showSyncModal}
        onClose={() => setShowSyncModal(false)}
        onExport={exportRecipes}
        onImport={importRecipes}
        recipeCount={recipes.length}
      />

      {/* API Key Modal */}
      <APIKeyModal
        isOpen={showAPIKeyModal}
        onClose={() => setShowAPIKeyModal(false)}
        onSave={saveApiKey}
        currentKey={apiKey}
      />

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center sm:p-4 z-50">
          <div className="bg-white rounded-t-2xl sm:rounded-xl max-w-2xl w-full h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.name}
                className="w-full h-64 object-cover rounded-t-xl"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=600&h=400&fit=crop&auto=format';
                }}
              />
              <button
                onClick={() => {
                  setSelectedRecipe(null);
                  setIsEditingNotes(false);
                  setEditedNotes('');
                }}
                className="absolute right-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl"
                style={{ top: 'max(calc(env(safe-area-inset-top) + 1rem), 1rem)' }}
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-2">{selectedRecipe.name}</h1>
              <p className="text-gray-600 mb-4 flex items-center">
                By {selectedRecipe.source}
                {selectedRecipe.extractionMethod === 'photo' && (
                  <span className="ml-2 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">📷 Scanned with AI</span>
                )}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  Prep: {selectedRecipe.prepTime}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  Cook: {selectedRecipe.cookTime}
                </div>
                <div className="flex items-center text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="mr-2">Serves:</span>
                  <button
                    onClick={() => setCurrentServings(Math.max(1, currentServings - 1))}
                    className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    −
                  </button>
                  <span className="mx-3 font-semibold min-w-[2rem] text-center">{currentServings}</span>
                  <button
                    onClick={() => setCurrentServings(currentServings + 1)}
                    className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    +
                  </button>
                  {currentServings !== selectedRecipe.servings && (
                    <button
                      onClick={() => setCurrentServings(selectedRecipe.servings)}
                      className="ml-2 text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedRecipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Interactive Rating */}
              <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Rate this recipe:</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => updateRecipeRating(selectedRecipe.id, i + 1)}
                      className="hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          i < selectedRecipe.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold">Ingredients</h2>
                  {currentServings !== selectedRecipe.servings && (
                    <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      Scaled for {currentServings} servings
                    </span>
                  )}
                </div>
                <ul className="space-y-2">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>
                        {currentServings !== selectedRecipe.servings
                          ? scaleIngredient(ingredient, selectedRecipe.servings, currentServings)
                          : ingredient
                        }
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Instructions</h2>
                <ol className="space-y-3">
                  {selectedRecipe.instructions.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold">Notes</h2>
                  {!isEditingNotes && (
                    <button
                      onClick={() => {
                        setIsEditingNotes(true);
                        setEditedNotes(selectedRecipe.notes || '');
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {selectedRecipe.notes ? 'Edit' : 'Add Notes'}
                    </button>
                  )}
                </div>
                
                {isEditingNotes ? (
                  <div className="space-y-3">
                    <textarea
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                      placeholder="Add your personal notes, modifications, or tips..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows="4"
                      autoFocus
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          updateRecipeNotes(selectedRecipe.id, editedNotes);
                          setIsEditingNotes(false);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingNotes(false);
                          setEditedNotes('');
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={`p-3 rounded-lg ${selectedRecipe.notes ? 'bg-gray-50' : 'bg-gray-50 text-gray-500 italic'}`}>
                    {selectedRecipe.notes || 'No notes yet. Click "Add Notes" to add your own.'}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                {selectedRecipe.url ? (
                  <a
                    href={selectedRecipe.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View Original Recipe
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm">Scanned from photo</span>
                )}
                <button
                  onClick={() => deleteRecipe(selectedRecipe.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete Recipe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PWA Install Prompt */}
      {showPWAPrompt && (
        <PWAInstallPrompt onClose={dismissPWAPrompt} onInstall={handlePWAInstall} />
      )}
    </div>
  );
}