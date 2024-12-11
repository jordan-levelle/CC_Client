// src/components/ProductDisplay.js
import React, { useState } from "react";
import { Box, Slider, TextField, Button, Typography } from "@mui/material";
import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded";
import SentimentNeutralRoundedIcon from "@mui/icons-material/SentimentNeutralRounded";
import SentimentSatisfiedAltRoundedIcon from "@mui/icons-material/SentimentSatisfiedAltRounded";
import SentimentVerySatisfiedRoundedIcon from "@mui/icons-material/SentimentVerySatisfiedRounded";

const ProductDisplay = ({ handleCheckout }) => {
  const [sliderValue, setSliderValue] = useState(0);

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  const handleInputChange = (event) => {
    const value = Number(event.target.value);
    if (value >= 0) setSliderValue(value);
  };

  const handleInputBlur = () => {
    if (sliderValue < 0) setSliderValue(0);
    if (sliderValue > 50) setSliderValue(50);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Become A Supporter
      </Typography>
      <Typography variant="body1">
        Adjust your support level and contribute annually.
      </Typography>
      <Box sx={{ display: "flex", width: '320px', alignItems: "center", mt: 3, gap: 2 }}>
        <Slider
          value={sliderValue}
          step={1}
          min={0}
          max={50}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
        />
        $
        <TextField
          type="number"
          value={sliderValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          label="Support Level"
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, minWidth:'250px' }}>
        <SentimentDissatisfiedRoundedIcon
            sx={{ color: sliderValue <= 12 ? "error.main" : "grey.500" }}
        />
        <SentimentNeutralRoundedIcon
            sx={{ color: sliderValue > 12 && sliderValue <= 25 ? "warning.main" : "grey.500" }}
        />
        <SentimentSatisfiedAltRoundedIcon
            sx={{ color: sliderValue > 25 && sliderValue <= 37 ? "success.main" : "grey.500" }}
        />
        <SentimentVerySatisfiedRoundedIcon
            sx={{ color: sliderValue > 37 ? "primary.main" : "grey.500" }}
        />
        </Box>
      <Button
        variant="contained"
        onClick={() => handleCheckout(sliderValue)}
        sx={{ mt: 3 }}
      >
        Checkout
      </Button>
    </Box>
  );
};

export default ProductDisplay;
