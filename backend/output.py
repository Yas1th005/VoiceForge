import os
from pydub import AudioSegment
import logging
from pydub.exceptions import CouldntDecodeError

# Set up logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Supported formats
SUPPORTED_FORMATS = ["mp3", "wav", "flac", "ogg", "aac", "m4a"]

def convert_audio(input_file: str, output_format: str, output_dir: str = "converted_audio") -> str:
    """
    Converts an audio file to the specified format.

    Args:
        input_file (str): Path to the input audio file.
        output_format (str): Desired output format (e.g., "mp3", "wav").
        output_dir (str): Directory to save the converted file. Defaults to "converted_audio".

    Returns:
        str: Path to the converted audio file.

    Raises:
        ValueError: If the input file or output format is invalid.
        CouldntDecodeError: If the input file cannot be decoded.
        Exception: For any other unexpected errors.
    """
    try:
        # Validate input file
        if not os.path.isfile(input_file):
            raise ValueError(f"Input file '{input_file}' does not exist.")

        # Validate output format
        if output_format.lower() not in SUPPORTED_FORMATS:
            raise ValueError(f"Unsupported output format: {output_format}. Supported formats: {SUPPORTED_FORMATS}")

        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)

        # Load the input audio file
        logging.info(f"Loading audio file: {input_file}")
        audio = AudioSegment.from_file(input_file)

        # Generate output file path
        input_filename = os.path.splitext(os.path.basename(input_file))[0]
        output_file = os.path.join(output_dir, f"{input_filename}.{output_format.lower()}")

        # Export the audio to the desired format
        logging.info(f"Converting to {output_format.upper()}...")
        audio.export(output_file, format=output_format.lower())
        logging.info(f"Conversion successful! File saved as: {output_file}")

        return output_file

    except CouldntDecodeError as e:
        logging.error(f"Failed to decode the input file: {e}")
        raise
    except ValueError as e:
        logging.error(f"Invalid input: {e}")
        raise
    except Exception as e:
        logging.error(f"An unexpected error occurred: {e}")
        raise

def main():
    """
    Main function to handle user input and perform audio conversion.
    """
    print("=== Audio File Converter ===")
    print(f"Supported formats: {', '.join(SUPPORTED_FORMATS)}")

    # Get user input
    input_file = input("Enter the path to the audio file: ").strip()
    output_format = input(f"Enter the desired output format ({', '.join(SUPPORTED_FORMATS)}): ").strip().lower()

    try:
        # Perform conversion
        output_file = convert_audio(input_file, output_format)
        print(f"\nConversion complete! File saved as: {output_file}")
    except Exception as e:
        print(f"\nError: {e}")
    finally:
        print("\nThank you for using the Audio File Converter!")

if __name__ == "__main__":
    main()