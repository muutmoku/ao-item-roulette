import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  ListSubheader,
  Alert,
  IconButton,
  Divider,
  Box,
  Grid,
  Button,
  ListItemAvatar,
  Avatar,
  Select,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Wheel } from "react-custom-roulette";

export type Items = {
  armor: {};
  bag: {};
  cape: {};
  food: {};
  head: {};
  mainhand: {};
  offhand: {};
  potion: {};
  shoes: {};
};

const defaultItems: Items = {
  armor: {},
  bag: {},
  cape: {},
  food: {},
  head: {},
  mainhand: {},
  offhand: {},
  potion: {},
  shoes: {},
};
const languages = [
  { code: "EN-US", label: "🇺🇸" },
  { code: "JA-JP", label: "🇯🇵" },
  { code: "DE-DE", label: "🇩🇪" },
  { code: "FR-FR", label: "🇫🇷" },
  { code: "IT-IT", label: "🇮🇹" },
  { code: "RU-RU", label: "🇷🇺" },
  { code: "PL-PL", label: "🇵🇱" },
  { code: "TR-TR", label: "🇹🇷" },
  { code: "ID-ID", label: "🇮🇩" },
  { code: "AR-SA", label: "🇸🇦" },
  { code: "KO-KR", label: "🇰🇷" },
  { code: "PT-BR", label: "🇧🇷" },
  { code: "ZH-TW", label: "🇹🇼" },
  { code: "ZH-CN", label: "🇨🇳" },
  { code: "ES-ES", label: "🇪🇸" },
];

type Item = {
  uniqueName: string;
  [key: string]: any;
};

const RADIUS = 180;
const IMAGE_SIZE = 217;

const getSizeMultiplier = (radius: number, itemsCount: number) => {
  let base = IMAGE_SIZE > radius * 0.9 ? (radius * 0.9) / IMAGE_SIZE : 1;
  base *= 1 - itemsCount * 0.04;
  return base;
};

const getOffsetY = (radius: number, drawSize: number) => {
  return radius - drawSize / 3;
};

function App() {
  const [items, setItems] = useState<any>(defaultItems);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(-1);
  const [addedItems, setAddedItems] = useState<Item[]>([]);
  const [selectedItemList, setselectedItemList] = useState<Item[]>([]);
  const [selectedType, setSelectedType] = useState<any>([]);
  const [selectedItem, setSelectedItem] = useState<any>("");
  const [selectedSize, setSelectedSize] = useState<number>(1);
  const [menuEl, setMenuEl] = useState<null | HTMLElement>(null);
  const [gearEl, setGearEl] = useState<null | HTMLElement>(null);
  const [languageEl, setLanguageEl] = useState<null | HTMLElement>(null);

  const theme = useTheme();
  const backgroundColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
  ];

  const handleAddItem = () => {
    if (!selectedType || !selectedItem) return;
    const already = addedItems.some((item) => item.uniqueName === selectedItem);
    if (already) return;

    const newItem = items[selectedType].find(
      (item: Item) => item.uniqueName === selectedItem,
    );
    newItem.size = selectedSize;
    if (newItem) setAddedItems([...addedItems, newItem]);
  };

  const handleSpinClick = () => {
    const rand = Math.floor(Math.random() * addedItems.length);
    setPrizeNumber(rand);
    setMustSpin(true);
  };
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuEl(null);
  };
  const handleGearOpen = (event: React.MouseEvent<HTMLElement>) => {
    setGearEl(event.currentTarget);
  };

  const handleGearClose = () => {
    setGearEl(null);
  };
  const handleLanguageOpen = (e: React.MouseEvent<HTMLElement>) =>
    setLanguageEl(e.currentTarget);
  const handleLanguageClose = () => setLanguageEl(null);
  const [lang, setLang] = useState("JA-JP");

  useEffect(() => {
    setselectedItemList(items[selectedType] || []);
  }, [items, selectedType]);

  useEffect(() => {
    const fetchAllItems = async () => {
      const results = await Promise.all(
        Object.keys(items).map(async (item) => {
          const res = await fetch(
            `https://muutmoku.github.io/ao-item-snapshot/data/latest/${item}.json`,
          );
          const data = await res.json();
          const parsedData = (data as Item[]).map((item) => ({
            uniqueName: item.uniqueName,
            localizedNames: item.localizedNames,
          }));
          return [item, parsedData] as [string, any];
        }),
      );
      const newItems = Object.fromEntries(results);
      setItems(newItems);
    };
    fetchAllItems();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <AppBar>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={menuEl}
            open={Boolean(menuEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              component="a"
              href="https://muutmoku.github.io/ao-item-roulette/"
            >
              Albion Online Item Roulette
            </MenuItem>
            <MenuItem
              component="a"
              href="https://muutmoku.github.io/ao-guild-viewer//"
            >
              Albion Online Guild Viewer
            </MenuItem>
            <MenuItem
              component="a"
              href="https://muutmoku.github.io/ao-build-share/"
            >
              Albion Online Build Share
            </MenuItem>
            <MenuItem
              component="a"
              href="https://muutmoku.github.io/ao-item-snapshot/"
            >
              Albion Online Item Snapshot
            </MenuItem>
            <Divider />
            <MenuItem
              component="a"
              href="https://twitch.com/muutmoku"
              target="_blank"
            >
              Author's Twitch
            </MenuItem>
          </Menu>
          <Box sx={{ flexGrow: 1, textAlign: "center" }}>
            <Typography variant="h6">Albion Online Item Roulette</Typography>
          </Box>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="settings"
            onClick={handleGearOpen}
          >
            <SettingsIcon />
          </IconButton>
          <Menu
            anchorEl={gearEl}
            open={Boolean(gearEl)}
            onClose={handleGearClose}
          >
            <MenuItem onClick={handleLanguageOpen}>
              Language
              <ArrowRightIcon />
            </MenuItem>
          </Menu>
          <Menu
            anchorEl={languageEl}
            open={Boolean(languageEl)}
            onClose={handleLanguageClose}
          >
            {languages.map((option) => (
              <MenuItem
                key={option.code}
                selected={lang === option.code}
                onClick={() => {
                  setLang(option.code);
                  handleLanguageClose();
                  handleGearClose();
                }}
              >
                <span style={{ marginRight: 8 }}>{option.label}</span>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>
      <Box mt={10} />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
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
            <Autocomplete
              options={selectedItemList}
              getOptionLabel={(option) =>
                option.localizedNames[lang] || option.uniqueName
              }
              value={
                selectedItemList.find(
                  (item) => item.uniqueName === selectedItem,
                ) || null
              }
              onChange={(_, newValue) =>
                setSelectedItem(newValue ? newValue.uniqueName : "")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                />
              )}
              isOptionEqualToValue={(option, value) =>
                option.uniqueName === value.uniqueName
              }
            />

            <TextField
              label="Size"
              type="number"
              value={selectedSize}
              onChange={(e) => {
                const val = Math.max(
                  1,
                  Math.floor(Number(e.target.value) || 1),
                );
                setSelectedSize(val);
              }}
              inputProps={{
                min: 1,
                step: 1,
              }}
              fullWidth
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddItem}
            >
              Add
            </Button>
            <Box mt={2} />
            <Paper variant="outlined">
              <List subheader={<ListSubheader>Added items</ListSubheader>}>
                {addedItems.map((addedItem: Item, idx: number) => (
                  <>
                    <ListItem
                      key={addedItem.uniqueName}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() =>
                            setAddedItems((prev) =>
                              prev.filter(
                                (item) =>
                                  item.uniqueName !== addedItem.uniqueName,
                              ),
                            )
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar
                          variant="square"
                          alt={addedItem.localizedNames[lang]}
                          src={`https://render.albiononline.com/v1/item/${addedItem.uniqueName}.png`}
                        />
                      </ListItemAvatar>
                      <ListItemText primary={addedItem.localizedNames[lang]} />
                      <TextField
                        label="size"
                        type="number"
                        size="small"
                        value={addedItem.size ?? 1}
                        inputProps={{ min: 1, step: 1 }}
                        onChange={(e) => {
                          const newSize = Math.max(
                            1,
                            Math.floor(Number(e.target.value) || 1),
                          );
                          setAddedItems((prev) =>
                            prev.map((item, i) =>
                              i === idx ? { ...item, size: newSize } : item,
                            ),
                          );
                        }}
                        sx={{ width: 80, ml: 2 }}
                      />
                    </ListItem>
                    {idx < addedItems.length - 1 && <Divider component="li" />}
                  </>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            {!mustSpin && prizeNumber >= 0 ? (
              <>
                <Alert variant="outlined" severity="info">
                  {addedItems[prizeNumber]?.localizedNames[lang]}
                </Alert>
              </>
            ) : (
              <></>
            )}
            {addedItems.length ? (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                width="100%"
              >
                <Wheel
                  mustStartSpinning={mustSpin}
                  prizeNumber={prizeNumber}
                  data={addedItems?.map((item, r, arr) => {
                    const sizeMultiplier = getSizeMultiplier(
                      RADIUS,
                      arr.length,
                    );
                    const drawSize = IMAGE_SIZE * sizeMultiplier;
                    return {
                      option: item.localizedNames[lang],
                      style: {
                        fontSize: 7,
                      },
                      image: {
                        uri: `https://render.albiononline.com/v1/item/${item.uniqueName}.png`,
                        offsetY: getOffsetY(RADIUS, drawSize),
                        sizeMultiplier,
                      },
                      optionSize: item.size,
                    };
                  })}
                  onStopSpinning={() => setMustSpin(false)}
                  backgroundColors={backgroundColors}
                  textColors={["#fff"]}
                />
                <Button
                  variant="contained"
                  onClick={handleSpinClick}
                  style={{ marginTop: "24px" }}
                >
                  SPIN
                </Button>
              </Box>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default App;
