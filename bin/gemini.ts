/**
 * Gemini Image Generator CLI
 *
 * PROMPT ENGINEERING GUIDE FOR IMAGE GENERATION
 * ==============================================
 *
 * Writing effective prompts is key to getting great results from Gemini's image generation.
 * Follow these best practices based on Google's official documentation:
 *
 * 1. BE HYPER-SPECIFIC
 *    - Provide extremely detailed descriptions instead of generic terms
 *    - Bad:  "fantasy armor"
 *    - Good: "ornate elven plate armor, etched with silver leaf patterns, with a high
 *             collar and pauldrons shaped like falcon wings"
 *
 * 2. PROVIDE CONTEXT AND INTENT
 *    - Explain the purpose or use case of the image
 *    - Bad:  "Create a logo"
 *    - Good: "Create a logo for a high-end, minimalist skincare brand"
 *
 * 3. USE NARRATIVE AND DESCRIPTIVE LANGUAGE
 *    - Write in descriptive paragraphs rather than disconnected keywords
 *    - The model responds better to natural language descriptions
 *    - Example: "A serene mountain landscape at golden hour, with mist rolling through
 *               the valley below. The foreground features a weathered pine tree, its
 *               branches stretching toward a sky painted in warm oranges and purples."
 *
 * 4. USE PHOTOGRAPHIC AND CINEMATIC LANGUAGE
 *    - Shot types: "wide-angle shot", "macro shot", "close-up", "aerial view"
 *    - Lighting: "soft diffused lighting", "dramatic side lighting", "golden hour"
 *    - Mood: "moody atmosphere", "ethereal quality", "vibrant and energetic"
 *
 * 5. STRUCTURE COMPLEX SCENES STEP-BY-STEP
 *    - Break down complex compositions into sequential instructions
 *    - Example: "First, create a background of a misty forest at dawn. Then, in the
 *               foreground, place a stone bridge covered in moss. Finally, add a figure
 *               in a red cloak crossing the bridge."
 *
 * PROMPT STRUCTURE TEMPLATES:
 *
 * Photorealistic Scenes:
 *   "A [shot type] of [subject], [action], set in [environment].
 *    Illuminated by [lighting], creating a [mood] atmosphere."
 *
 * Stylized Illustrations:
 *   "A [style] illustration of [subject], featuring [characteristics],
 *    with [color palette]."
 *
 * Product Photography:
 *   "A high-resolution, studio-lit product photograph of [product] on [background].
 *    Lighting setup [description]. Camera angle [specific angle] to showcase [feature]."
 *
 * ITERATIVE REFINEMENT:
 * - Start with a base prompt, then refine in follow-up requests
 * - Use specific adjustment requests like "Keep everything the same, but make the
 *   lighting warmer and softer"
 *
 * WHAT TO AVOID:
 * - Don't use disconnected keywords (e.g., "sunset, mountains, river, trees")
 * - Avoid vague descriptions without specifics
 * - Don't rely solely on negative prompts (describe what you want positively)
 *
 * EXAMPLE PROMPTS:
 *
 * Landscape:
 *   "A breathtaking wide-angle landscape photograph of the Norwegian fjords at sunset.
 *    Steep cliffs rise dramatically from crystal-clear waters that reflect the warm
 *    orange and pink hues of the sky. In the foreground, smooth weathered rocks frame
 *    the composition. Shot with a DSLR, using a polarizing filter to enhance the
 *    colors and reduce reflections."
 *
 * Character Design:
 *   "A character design illustration of a steampunk inventor in their workshop. The
 *    character wears brass goggles pushed up on their forehead, a leather apron
 *    covered in pockets and tools, and has grease stains on their hands. The workshop
 *    background features intricate clockwork mechanisms, blueprints, and warm Edison
 *    bulb lighting. Art style: detailed digital painting with rich warm tones."
 *
 * Product:
 *   "A professional product photograph of a luxury wristwatch on a polished black
 *    marble surface. The watch features a rose gold case and black leather strap.
 *    Lighting: soft key light from the left with subtle rim lighting to highlight
 *    the watch's curves. Shot from a 45-degree angle to showcase both the face and
 *    the band. Ultra high-resolution with sharp focus on the watch details."
 *
 * Abstract/Artistic:
 *   "An abstract digital art piece exploring the concept of data flow. Flowing ribbons
 *    of luminous blue and purple light weave through a dark space, forming intricate
 *    patterns reminiscent of neural networks. Particles of light scatter and cluster
 *    along the ribbons. Style: modern digital art with a cyberpunk aesthetic and
 *    high contrast."
 *
 * TIPS:
 * - The more detail you provide, the more control you have over the result
 * - Use aspect ratios (-a flag) to match your intended use case
 * - Best performance in English, Spanish, and Japanese
 * - All generated images include a SynthID watermark
 */

import { GoogleGenAI } from "@google/genai";
import mime from "mime";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve } from "path";
import "dotenv/config";

const VERSION = "1.0.0";

interface CliOptions {
  prompt: string;
  output: string;
  model: string;
  modalities: string[];
  verbose: boolean;
  dir?: string;
  aspectRatio?: string;
}

function showHelp() {
  console.log(`Gemini Image Generator CLI v${VERSION}

DESCRIPTION:
  Generate images and audio using Google's Gemini AI models with text prompts.
  Requires GEMINI_API_KEY environment variable to be set.

USAGE:
  npm run gemini -- [OPTIONS] <prompt> <filename>
  npx tsx bin/gemini.ts [OPTIONS] <prompt> <filename>

ARGUMENTS:
  <prompt>      Text prompt for image generation
  <filename>    Output filename without extension

OPTIONS:
  -p, --prompt <text>       Text prompt (alternative to positional arg)
  -o, --output <name>       Output filename (alternative to positional arg)
  -m, --model <model>       Gemini model to use (default: gemini-2.5-flash-image)
  -M, --modalities <list>   Comma-separated response modalities (default: IMAGE,TEXT)
  -a, --aspect <ratio>      Image aspect ratio (e.g., 16:9, 1:1, 3:2)
  -d, --dir <directory>     Output directory (default: current directory)
  -v, --verbose             Enable verbose logging
  -h, --help                Show this help message
  --version                 Show version number

AVAILABLE MODELS:
  - gemini-2.5-flash-image (default, fastest)
  - gemini-2.5-pro-image (higher quality)

MODALITIES:
  IMAGE, TEXT, AUDIO (comma-separated, e.g., "IMAGE,TEXT")

ASPECT RATIOS:
  1:1 (1024x1024, default), 2:3 (832x1248), 3:2 (1248x832),
  3:4 (864x1184), 4:3 (1184x864), 4:5 (896x1152), 5:4 (1152x896),
  9:16 (768x1344), 16:9 (1344x768), 21:9 (1536x672)

ENVIRONMENT:
  GEMINI_API_KEY           Required. Your Google Gemini API key.
                          Get one at: https://aistudio.google.com/apikey

EXAMPLES:
  # Generate an image with positional arguments
  npm run gemini -- "une image d'un renard mystique" fox_image

  # Using named arguments
  npm run gemini -- --prompt "un paysage de montagne" --output mountain

  # Specify model and output directory
  npm run gemini -- -m gemini-2.5-pro-image -d ./images "un coucher de soleil" sunset

  # Verbose mode with detailed logging
  npm run gemini -- -v "une forêt enchantée" forest

  # Generate audio (experimental)
  npm run gemini -- -M "AUDIO" "une mélodie relaxante de piano" piano_melody

  # Generate multiple modalities (image and audio)
  npm run gemini -- -M "IMAGE,AUDIO,TEXT" "une scène de pluie" rain_scene

  # Generate widescreen image
  npm run gemini -- -a 16:9 "un paysage panoramique" landscape
`);
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);

  // Handle version flag
  if (args.includes("--version")) {
    console.log(`v${VERSION}`);
    process.exit(0);
  }

  // Handle help flag
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    showHelp();
    process.exit(args.includes("--help") || args.includes("-h") ? 0 : 1);
  }

  let prompt = "";
  let output = "";
  let model = "gemini-2.5-flash-image";
  let modalities = ["IMAGE", "TEXT"];
  let verbose = false;
  let dir: string | undefined = undefined;
  let aspectRatio: string | undefined = undefined;

  // Parse all flags
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case "-p":
      case "--prompt":
        if (nextArg && !nextArg.startsWith("-")) {
          prompt = nextArg;
          i++;
        }
        break;
      case "-o":
      case "--output":
        if (nextArg && !nextArg.startsWith("-")) {
          output = nextArg;
          i++;
        }
        break;
      case "-m":
      case "--model":
        if (nextArg && !nextArg.startsWith("-")) {
          model = nextArg;
          i++;
        }
        break;
      case "-M":
      case "--modalities":
        if (nextArg && !nextArg.startsWith("-")) {
          modalities = nextArg.split(",").map((m) => m.trim().toUpperCase());
          i++;
        }
        break;
      case "-a":
      case "--aspect":
        if (nextArg && !nextArg.startsWith("-")) {
          aspectRatio = nextArg;
          i++;
        }
        break;
      case "-d":
      case "--dir":
        if (nextArg && !nextArg.startsWith("-")) {
          dir = nextArg;
          i++;
        }
        break;
      case "-v":
      case "--verbose":
        verbose = true;
        break;
    }
  }

  // If not found via flags, try positional arguments
  if (!prompt || !output) {
    // Get all arguments that aren't flags and weren't already consumed
    const positionalArgs: string[] = [];
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      // Skip if it's a flag
      if (arg.startsWith("-")) {
        // Skip the flag and its value if it has one
        if (
          ["-p", "--prompt", "-o", "--output", "-m", "--model", "-M", "--modalities", "-a", "--aspect", "-d", "--dir"].includes(arg)
        ) {
          i++; // Skip next arg (the value)
        }
        continue;
      }
      positionalArgs.push(arg);
    }

    if (positionalArgs.length >= 2) {
      prompt = prompt || positionalArgs[0];
      output = output || positionalArgs[1];
    } else if (positionalArgs.length === 1 && !prompt && !output) {
      // Only one positional arg provided, unclear which one it is
      console.error("❌ Error: Please provide both prompt and output filename");
      console.error("   Use named arguments: -p \"prompt\" -o filename");
      console.error("   Or positional: \"prompt\" filename");
      process.exit(1);
    }
  }

  // Validate required arguments
  if (!prompt || !output) {
    console.error("❌ Error: Both prompt and output filename are required\n");
    console.log("Run with --help for usage information");
    process.exit(1);
  }

  return { prompt, output, model, modalities, verbose, dir, aspectRatio };
}

function saveBinaryFile(fileName: string, content: Buffer) {
  try {
    writeFileSync(fileName, content);
    console.log(`File ${fileName} saved to file system.`);
  } catch (err) {
    console.error(`Error writing file ${fileName}:`, err);
  }
}

async function main() {
  const options = parseArgs();

  // Validate API key
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ Error: GEMINI_API_KEY environment variable is not set");
    console.error("\nPlease set your API key:");
    console.error("  export GEMINI_API_KEY='your-api-key'");
    console.error("\nGet an API key at: https://aistudio.google.com/apikey");
    console.error("Or add it to your .env file");
    process.exit(1);
  }

  // Prepare output path
  let outputPath = options.output;
  if (options.dir) {
    const outputDir = resolve(options.dir);
    if (!existsSync(outputDir)) {
      if (options.verbose) {
        console.log(`📁 Creating directory: ${outputDir}`);
      }
      mkdirSync(outputDir, { recursive: true });
    }
    outputPath = resolve(outputDir, options.output);
  }

  if (options.verbose) {
    console.log("🚀 Starting image generation...");
    console.log(`📝 Prompt: "${options.prompt}"`);
    console.log(`🤖 Model: ${options.model}`);
    console.log(`📊 Modalities: ${options.modalities.join(", ")}`);
    if (options.aspectRatio) {
      console.log(`📐 Aspect Ratio: ${options.aspectRatio}`);
    }
    console.log(`💾 Output: ${outputPath}`);
    console.log();
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const config: {
      responseModalities: string[];
      imageConfig?: { aspectRatio: string };
    } = {
      responseModalities: options.modalities,
    };

    if (options.aspectRatio) {
      config.imageConfig = {
        aspectRatio: options.aspectRatio,
      };
    }

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: options.prompt,
          },
        ],
      },
    ];

    if (options.verbose) {
      console.log("⏳ Generating images...\n");
    }

    const response = await ai.models.generateContentStream({
      model: options.model,
      config,
      contents,
    });

    let fileIndex = 0;
    let imageCount = 0;
    let audioCount = 0;

    for await (const chunk of response) {
      if (
        !chunk.candidates ||
        !chunk.candidates[0].content ||
        !chunk.candidates[0].content.parts
      ) {
        continue;
      }

      const parts = chunk.candidates[0].content.parts;

      // Process all parts (not just the first one)
      for (const part of parts) {
        if (part.inlineData) {
          const fileName =
            fileIndex === 0 ? outputPath : `${outputPath}_${fileIndex}`;
          fileIndex++;

          const inlineData = part.inlineData;
          const mimeType = inlineData.mimeType || "";
          const fileExtension = mime.getExtension(mimeType);
          const buffer = Buffer.from(inlineData.data || "", "base64");
          const fullPath = `${fileName}.${fileExtension}`;

          // Determine file type from MIME type
          const isImage = mimeType.startsWith("image/");
          const isAudio = mimeType.startsWith("audio/");

          if (isImage) {
            imageCount++;
            saveBinaryFile(fullPath, buffer);
            if (options.verbose) {
              console.log(`🖼️  Saving image ${imageCount}: ${fullPath}`);
            }
          } else if (isAudio) {
            audioCount++;
            saveBinaryFile(fullPath, buffer);
            if (options.verbose) {
              console.log(`🎵 Saving audio ${audioCount}: ${fullPath}`);
            }
          } else {
            // Unknown type, save it anyway
            saveBinaryFile(fullPath, buffer);
            if (options.verbose) {
              console.log(`💾 Saving file (${mimeType}): ${fullPath}`);
            }
          }
        } else if (part.text) {
          if (options.verbose) {
            console.log("📄 Text response:");
          }
          console.log(part.text);
        }
      }
    }

    // Summary messages
    const outputs = [];
    if (imageCount > 0) {
      outputs.push(`${imageCount} image${imageCount > 1 ? "s" : ""}`);
    }
    if (audioCount > 0) {
      outputs.push(`${audioCount} audio file${audioCount > 1 ? "s" : ""}`);
    }

    if (outputs.length === 0) {
      console.warn("\n⚠️  No files were generated");
    } else if (!options.verbose) {
      console.log(`✅ Generated ${outputs.join(" and ")}`);
    }
  } catch (error) {
    console.error("\n❌ Error during generation:");
    if (error instanceof Error) {
      console.error(`  ${error.message}`);
      if (options.verbose && error.stack) {
        console.error("\nStack trace:");
        console.error(error.stack);
      }
    } else {
      console.error(`  ${String(error)}`);
    }
    process.exit(1);
  }
}

main();
