import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Download, Wifi, WifiOff, Star, Clock, Users, Tag, Filter, ChefHat, Sparkles, Camera, Upload, X, Settings } from 'lucide-react';

// PWA Installation prompt
const PWAInstallPrompt = ({ onClose }) => (
  <div className="fixed bottom-4 left-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl shadow-lg z-50 md:left-auto md:right-4 md:max-w-sm">
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
    <button className="mt-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium w-full transition-colors">
      Install App
    </button>
  </div>
);

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
      <div className="flex justify-between items-center p-4 text-white">
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
        <button
          onClick={capturePhoto}
          disabled={!isStreaming}
          className="w-full bg-white text-black py-4 rounded-full font-semibold disabled:opacity-50 flex items-center justify-center"
        >
          <Camera className="h-6 w-6 mr-2" />
          Capture Recipe
        </button>
        <p className="text-white/70 text-sm text-center mt-2">
          Make sure the recipe text is clear and well-lit
        </p>
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
    return store.add(recipe);
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
    ]
  }
];

// Client-side Gemini API integration
const extractRecipeWithGemini = async (content, apiKey, isImage = false) => {
  try {
    const { GoogleGenerativeAI } = await import('https://esm.run/@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Extract recipe information and return ONLY a JSON object with this exact structure:

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

Important:
- Return ONLY valid JSON, no explanations
- Extract exact ingredients with quantities
- Break instructions into clear steps
- Add 2-4 relevant tags like: Vegetarian, Healthy, Quick, etc.
- If information is unclear, make reasonable estimates`;

    let result;
    if (isImage) {
      // Convert blob to base64 for image processing
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        };
        reader.readAsDataURL(content);
      });

      const imagePart = {
        inlineData: {
          data: base64,
          mimeType: content.type
        }
      };

      result = await model.generateContent([prompt, imagePart]);
    } else {
      result = await model.generateContent(prompt + "\n\nContent:\n" + content);
    }

    const response = await result.response;
    const text = response.text();
    
    // Clean and parse JSON
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanedText);
    
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to extract recipe. Please check your API key and try again.');
  }
};

// Fetch webpage content using CORS proxy
const fetchWebpageContent = async (url) => {
  try {
    // Use CORS proxy for accessing external websites
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    const data = await response.json();
    return data.contents;
  } catch (error) {
    throw new Error('Failed to fetch webpage content');
  }
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
    
    if (!isStandalone && !localStorage.getItem('pwa-prompt-dismissed')) {
      const timer = setTimeout(() => setShowPWAPrompt(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissPWAPrompt = () => {
    setShowPWAPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
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
    if (!isOnline) {
      alert('Photo scanning requires internet connection');
      return;
    }

    if (!apiKey) {
      setShowAPIKeyModal(true);
      return;
    }
    
    setIsExtracting(true);
    try {
      const extractedRecipe = await extractRecipeWithGemini(photoFile, apiKey, true);
      
      // Add placeholder image (in a real app, you might store the photo)
      extractedRecipe.image = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000) + 1500000000000}-${Math.floor(Math.random() * 1000000) + 100000}?w=600&h=400&fit=crop&auto=format&q=80`;
      extractedRecipe.extractionMethod = 'photo';
      
      await recipeDB.addRecipe(extractedRecipe);
      const updatedRecipes = await recipeDB.getAllRecipes();
      setRecipes(updatedRecipes);
      setShowAddModal(false);
      
      console.log('Successfully extracted recipe from photo:', extractedRecipe.name);
      
    } catch (error) {
      console.error('Failed to extract recipe from photo:', error);
      
      let errorMessage = 'Failed to extract recipe from photo. ';
      if (error.message.includes('API key')) {
        errorMessage += 'Please check your API key in settings.';
        setShowAPIKeyModal(true);
      } else {
        errorMessage += 'Make sure the recipe text is clear and readable in the photo.';
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
      
      // Extract recipe using Gemini
      const extractedRecipe = await extractRecipeWithGemini(htmlContent, apiKey, false);
      extractedRecipe.url = url;
      extractedRecipe.extractionMethod = 'url';
      
      // Try to find a good image from the content
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const ogImage = doc.querySelector('meta[property="og:image"]');
      
      if (ogImage && ogImage.getAttribute('content')) {
        extractedRecipe.image = ogImage.getAttribute('content');
      } else {
        extractedRecipe.image = `https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=600&h=400&fit=crop&auto=format&q=80`;
      }
      
      await recipeDB.addRecipe(extractedRecipe);
      const updatedRecipes = await recipeDB.getAllRecipes();
      setRecipes(updatedRecipes);
      setShowAddModal(false);
      setNewRecipeUrl('');
      
      console.log('Successfully extracted recipe:', extractedRecipe.name);
      
    } catch (error) {
      console.error('Failed to extract recipe:', error);
      
      let errorMessage = 'Failed to extract recipe. ';
      if (error.message.includes('API key')) {
        errorMessage += 'Please check your API key in settings.';
        setShowAPIKeyModal(true);
      } else if (error.message.includes('fetch')) {
        errorMessage += 'Could not access the website. Please try a different URL.';
      } else {
        errorMessage += 'Please try again or check if the URL contains a valid recipe.';
      }
      
      alert(errorMessage);
    } finally {
      setIsExtracting(false);
    }
  };

  const deleteRecipe = async (id) => {
    try {
      await recipeDB.deleteRecipe(id);
      const updatedRecipes = await recipeDB.getAllRecipes();
      setRecipes(updatedRecipes);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-xl mr-3">
                <ChefHat className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Recipe Collection
                </h1>
                <div className="flex items-center text-xs text-gray-500">
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
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAPIKeyModal(true)}
                className={`p-2 rounded-xl transition-all ${
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
                className={`relative px-4 py-2 rounded-xl transition-all duration-200 flex items-center ${
                  showFilters 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white/60 hover:bg-white/80 text-gray-700 border border-gray-200/50'
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {(filters.cuisine || filters.difficulty || filters.tags.length > 0 || filters.maxCookTime) && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {[filters.cuisine, filters.difficulty, ...filters.tags, filters.maxCookTime].filter(Boolean).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Recipe
                <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">📷 AI</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap gap-6 items-center">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search recipes, cuisine, or ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 text-lg placeholder-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredRecipes.length > 0 && !isLoading && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredRecipes.length} of {recipes.length} recipes
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            [...Array(8)].map((_, index) => (
              <RecipeCardSkeleton key={index} />
            ))
          ) : (
            filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden hover:scale-105"
              >
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=400&h=300&fit=crop&auto=format';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {recipe.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 flex items-center">
                    {recipe.source}
                    {recipe.extractionMethod === 'photo' && (
                      <span className="ml-2 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">📷 Scanned</span>
                    )}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {recipe.cookTime}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {recipe.servings}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
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
                    <span className="text-sm font-medium text-gray-900">{recipe.cuisine}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
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
                        Extracting...
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
                    disabled={!isOnline}
                    className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                    disabled={!isOnline}
                    className="flex flex-col items-center p-6 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-xl hover:from-green-100 hover:to-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Upload className="h-8 w-8 text-green-600 mb-2" />
                    <span className="font-medium text-gray-900">Upload Photo</span>
                    <span className="text-xs text-gray-500 mt-1">From gallery</span>
                  </button>
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

      {/* API Key Modal */}
      <APIKeyModal
        isOpen={showAPIKeyModal}
        onClose={() => setShowAPIKeyModal(false)}
        onSave={saveApiKey}
        currentKey={apiKey}
      />

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
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
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl"
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
        <PWAInstallPrompt onClose={dismissPWAPrompt} />
      )}
    </div>
  );
}