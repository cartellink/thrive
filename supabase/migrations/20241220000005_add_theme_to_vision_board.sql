-- Add theme column to vision_board_items table
ALTER TABLE vision_board_items 
ADD COLUMN theme TEXT CHECK (theme IN ('amber', 'blue', 'green', 'purple', 'rose', 'indigo'));

-- Add comment to explain the theme column
COMMENT ON COLUMN vision_board_items.theme IS 'Color theme for text cards: amber, blue, green, purple, rose, or indigo';
