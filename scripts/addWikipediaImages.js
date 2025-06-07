#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

// Function to extract Wikipedia page title from URL
const getWikipediaTitle = (url) => {
  if (!url) return null;
  const match = url.match(/\/wiki\/([^?#]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

// Function to fetch Wikipedia image for a single URL
const fetchWikipediaImage = async (url) => {
  const title = getWikipediaTitle(url);
  if (!title) return null;
  
  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
    );
    const data = await response.json();
    return data.thumbnail?.source || null;
  } catch (error) {
    console.log(`Failed to fetch image for ${title}:`, error.message);
    return null;
  }
};

// Function to add images to timeline data
const addImagesToTimelineData = async (timelineData) => {
  console.log('Starting to fetch Wikipedia images...');
  let totalItems = 0;
  let itemsWithImages = 0;
  
  // Process each lane
  for (const lane of timelineData) {
    console.log(`Processing lane: ${lane.lane}`);
    
    // Process each item in the lane
    for (const item of lane.items) {
      totalItems++;
      
      if (item.url && item.url.includes('wikipedia.org')) {
        const imageUrl = await fetchWikipediaImage(item.url);
        if (imageUrl) {
          item.imageUrl = imageUrl;
          itemsWithImages++;
          console.log(`✓ Added image for: ${item.label}`);
        } else {
          console.log(`✗ No image found for: ${item.label}`);
        }
        
        // Add a small delay to be respectful to Wikipedia's API
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }
  
  console.log(`\nCompleted! Added images to ${itemsWithImages}/${totalItems} items`);
  return timelineData;
};

// Main function
const main = async () => {
  try {
    // Get input file path from command line argument
    const inputFile = process.argv[2];
    if (!inputFile) {
      console.error('Usage: node addWikipediaImages.js <path-to-timelineData.js>');
      console.error('Example: node scripts/addWikipediaImages.js src/data/laneData/timelineData.js');
      process.exit(1);
    }

    const fullPath = path.resolve(inputFile);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.error(`File not found: ${fullPath}`);
      process.exit(1);
    }

    console.log(`Reading timeline data from: ${fullPath}`);
    
    // Read and parse the timeline data file
    const fileContent = fs.readFileSync(fullPath, 'utf8');
    
    // Extract the timelineData array from the JS file
    // This handles both "export const timelineData = [...]" and "const timelineData = [...]"
    const match = fileContent.match(/(?:export\s+)?const\s+timelineData\s*=\s*(\[[\s\S]*?\]);?\s*(?:export|$)/);
    if (!match) {
      console.error('Could not find timelineData array in the file');
      process.exit(1);
    }

    const timelineDataString = match[1];
    let timelineData;
    
    try {
      // Use eval to parse the JavaScript array (since it's not pure JSON)
      timelineData = eval(`(${timelineDataString})`);
    } catch (error) {
      console.error('Failed to parse timeline data:', error.message);
      process.exit(1);
    }

    console.log(`Found ${timelineData.length} lanes in timeline data`);

    // Add images to the data
    const updatedData = await addImagesToTimelineData(timelineData);

    // Create output filename
    const outputFile = fullPath.replace('.js', '_with_images.js');
    
    // Generate the updated file content
    const updatedContent = `export const timelineData = ${JSON.stringify(updatedData, null, 2)};`;
    
    // Write the updated data to a new file
    fs.writeFileSync(outputFile, updatedContent, 'utf8');
    
    console.log(`\n✅ Updated timeline data written to: ${outputFile}`);
    console.log('\nTo use the updated data:');
    console.log(`1. Backup your original file: cp ${inputFile} ${inputFile}.backup`);
    console.log(`2. Replace with updated data: cp ${outputFile} ${inputFile}`);
    console.log(`3. Remove the temporary file: rm ${outputFile}`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

// Run the script
main().catch(console.error); 