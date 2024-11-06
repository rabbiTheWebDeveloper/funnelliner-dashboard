import { Box, Grid } from "@mui/material";
import styles from "./styles.module.css";
import globalStyles from "../../global.module.css";
import { cls } from "../../lib/utils";
import { Button } from "../../components/ui/button/button";
import { Dialog } from "../../components/ui/dialog/dialog";
import { Input } from "../../components/ui/input/input";
import { Label } from "../../components/ui/label/label";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card/card";

export const Settings = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    rent: "",
    payroll: "",
    utilityBill: "",
    pettyCash: "",
    depreciationCost: "",
  });

  // For storing custom items
  const [customItems, setCustomItems] = useState([]);
  
  // For the create new dialog
  const [newItem, setNewItem] = useState({
    name: "",
    value: "",
  });

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewItemChange = e => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("Saving settings:", formData);
    // Add your save logic here
  };

  const handleCreateNew = () => {
    if (newItem.name && newItem.value) {
      setCustomItems(prev => [...prev, { ...newItem, id: Date.now() }]);
      setOpen(false);
      setNewItem({ name: "", value: "" }); // Reset form
    }
  };

  return (
    <section>
      <div className={cls(globalStyles.header, globalStyles["flex"])}>
        <Box
          className={cls(globalStyles["flex-between"])}
          sx={{ gap: 1, width: "100%" }}
        >
          <h1>Settings</h1>
          <Button onClick={() => setOpen(true)}>Create New</Button>
        </Box>
      </div>

      <Box sx={{ mt: 3 }}>
        <Card>
          <CardHeader>
            <CardTitle>Fixed Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <div className={styles.inputGroup}>
                  <Label>Rent</Label>
                  <Input
                    type="number"
                    name="rent"
                    value={formData.rent}
                    onChange={handleInputChange}
                    placeholder="Enter rent amount"
                  />
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className={styles.inputGroup}>
                  <Label>Total Payroll (Salary)</Label>
                  <Input
                    type="number"
                    name="payroll"
                    value={formData.payroll}
                    onChange={handleInputChange}
                    placeholder="Enter total payroll"
                  />
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className={styles.inputGroup}>
                  <Label>Utility Bill</Label>
                  <Input
                    type="number"
                    name="utilityBill"
                    value={formData.utilityBill}
                    onChange={handleInputChange}
                    placeholder="Enter utility bill"
                  />
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className={styles.inputGroup}>
                  <Label>Petty Cash</Label>
                  <Input
                    type="number"
                    name="pettyCash"
                    value={formData.pettyCash}
                    onChange={handleInputChange}
                    placeholder="Enter petty cash"
                  />
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className={styles.inputGroup}>
                  <Label>Depreciation Cost</Label>
                  <Input
                    type="number"
                    name="depreciationCost"
                    value={formData.depreciationCost}
                    onChange={handleInputChange}
                    placeholder="Enter depreciation cost"
                  />
                </div>
              </Grid>
              
              {/* Custom Items */}
              {customItems.map(item => (
                <Grid item xs={12} md={6} key={item.id}>
                  <div className={styles.inputGroup}>
                    <Label>{item.name}</Label>
                    <Input
                      type="number"
                      value={item.value}
                      onChange={(e) => {
                        setCustomItems(prev =>
                          prev.map(i =>
                            i.id === item.id
                              ? { ...i, value: e.target.value }
                              : i
                          )
                        );
                      }}
                      placeholder={`Enter ${item.name.toLowerCase()}`}
                    />
                  </div>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 1 }}>
              <Button onClick={handleSave}>Save Changes</Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <div className={styles.dialogContent}>
          <h2>Create New Item</h2>
          <div className={styles.inputGroup}>
            <Label>Item Name</Label>
            <Input
              name="name"
              value={newItem.name}
              onChange={handleNewItemChange}
              placeholder="Enter item name"
            />
          </div>
          <div className={styles.inputGroup}>
            <Label>Value</Label>
            <Input
              type="number"
              name="value"
              value={newItem.value}
              onChange={handleNewItemChange}
              placeholder="Enter value"
            />
          </div>
          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <Button onClick={handleCreateNew}>Create</Button>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className={globalStyles["box-shadow-none"]}
            >
              Cancel
            </Button>
          </Box>
        </div>
      </Dialog>
    </section>
  );
};
