# Wheel Contents

This folder contains the content for the spinning wheels in ArtLila.

## File Format

Each line in the `.txt` files should follow this format:
```
Text Description|Emoji
```

**Important:** Use the pipe character `|` to separate the text from the emoji.

## Files

### topics.txt
Contains all the drawing topics (what to draw). Each line should have:
- A descriptive name for the topic
- An appropriate emoji

Example:
```
Wild Animals|🦁
Ocean Creatures|🐠
Robots|🤖
```

### constraints.txt
Contains all the drawing constraints (how to draw it). Each line should have:
- A descriptive constraint or challenge
- An appropriate emoji

Example:
```
One continuous line|✏️
Use only circles|⭕
Draw upside down|🙃
```

## How to Edit

1. Open the `.txt` file you want to modify
2. Add, remove, or edit lines following the format above
3. Save the file
4. Restart the development server (`npm run dev`) or refresh your deployed site

## Tips

- Keep descriptions short and kid-friendly
- Choose emojis that clearly represent the concept
- Each line becomes one segment on the wheel
- You can have any number of items (the wheel will adjust automatically)
- Make sure there are no empty lines in the middle of the file