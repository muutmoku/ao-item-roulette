import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Box, Grid, Button, Select, MenuItem, List, ListItem, ListItemText
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Wheel } from "react-custom-roulette";

export type Items = {
  mainhand: {},
};

const defaultItems: Items = {
  mainhand: {},
};

const lang = 'JA-JP';

type Item = { uniqueName: string;[key: string]: any };

function App() {
  const [items, setItems] = useState<any>(defaultItems);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [addedItems, setAddedItems] = useState<string[]>([]);
  const [selectedItemList, setselectedItemList] = useState<Item[]>([]);
  const [selectedType, setSelectedType] = useState<any>([]);
  const [selectedItem, setSelectedItem] = useState<any>("");

  const handleAddItem = () => {
    setAddedItems([...addedItems, selectedItem]);
  };

  const handleSpinClick = () => {
    const rand = Math.floor(Math.random() * addedItems.length);
    setPrizeNumber(rand);
    setMustSpin(true);
  };

  useEffect(() => {
    setselectedItemList(items[selectedType] || []);
  }, [items, selectedType]);

  useEffect(() => {
    const fetchAllItems = async () => {
      const results = await Promise.all(
        Object.keys(items).map(async (item) => {
          const res = await fetch(
            `https://muutmoku.github.io/ao-item-snapshot/data/latest/${item}.json`
          );
          const data = await res.json();
          const parsedData = (data as Item[]).map(item => ({
            uniqueName: item.uniqueName,
            localizedNames: item.localizedNames
          }));
          return [item, parsedData] as [string, any];
        })
      );
      const newItems = Object.fromEntries(results);
      setItems(newItems);
    };
    fetchAllItems();
  }, []);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6">
                Albion Online Item Roulette
              </Typography>
            </Box>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="settings"
            >
              <SettingsIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      <Box mt={10} />
      <Grid container sx={{ mx: 2 }}>
        <Grid item xs={12} md={6}>
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          >
            {Object.keys(items).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          >
            {
              selectedItemList.map((item) => (
                item.uniqueName && <MenuItem key={item.uniqueName} value={item.uniqueName}>
                  {item.localizedNames[lang]}
                </MenuItem>
              ))
            }
          </Select>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddItem}
          >Add</Button>
          <List>
            {addedItems.map((addedItem: string) => (
              <ListItem
                key={addedItem}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => { }}>
                    <DeleteIcon onClick={() =>
                      setAddedItems(prev => prev.filter(item => item !== addedItem))
                    } />
                  </IconButton>
                }
              >
                <ListItemText primary={addedItem} />
              </ListItem>
            ))}
          </List>
          <pre style={{ fontSize: "1.5rem" }}>
            {JSON.stringify(items, null, 2)}
          </pre>
        </Grid>
        <Grid item xs={12} md={6}>
          {
            addedItems.length &&
            <>
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={addedItems?.map(item => ({
                  option: item,
                  image: {
                    uri: `https://render.albiononline.com/v1/item/${item}.png`,
                    offsetY: 100,
                    sizeMultiplier: 1 - (addedItems.length * 0.05)
                  },
                }
                ))}
                onStopSpinning={() => setMustSpin(false)}
                backgroundColors={["#ffb300", "#ef5350", "#ab47bc", "#42a5f5"]}
                textColors={["#fff"]}
              />
              <Button variant="contained"
                onClick={handleSpinClick} style={{ marginTop: "24px" }}>
                SPIN
              </Button>
            </>
          }
        </Grid>
      </Grid >
    </>
  );
}

export default App;
