import React from "react";
import styles from "./sales-target-form.module.css";
import { Percent } from "lucide-react";
import { Button } from "../ui/button/button";
import { X } from "lucide-react";
import { CustomDateRangePicker } from "./CustomDateRangePicker";
import { Dialog } from "../ui/dialog/dialog";

export default function SalesTargetForm() {
  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({
    startDate: null,
    endDate: null
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button onClick={handleOpen}>Update Sales Target</Button>

      <Dialog open={open} onClose={handleClose}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <span className={styles.icon}>
              <Percent />
            </span>
            <h2 className={styles.title}>Update Sales Target in BDT</h2>
            <button className={styles.closeButton} onClick={handleClose}>
              <X />
            </button>
          </div>
          <form>
            <div className={styles.formGroup}>
              <label htmlFor="daily-target" className={styles.label}>
                Enter Daily Sales Target{" "}
                <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="daily-target"
                placeholder="5"
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="monthly-target" className={styles.label}>
                Enter Monthly Sales Target{" "}
                <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="monthly-target"
                placeholder="5"
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="custom-target" className={styles.label}>
                Enter Custom Sales Target{" "}
                <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="custom-target"
                placeholder="5"
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Choose Your Custom Targeting Date Range
              </label>
              <div className={styles.dateRange}>
                <div className={styles.dateInput}>
                  <label className={styles.dateLabel}>From</label>
                  <CustomDateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    placeholder="Select start date"
                    type="from"
                  />
                </div>
                <div className={styles.dateInput}>
                  <label className={styles.dateLabel}>To</label>
                  <CustomDateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    placeholder="Select end date"
                    type="to"
                  />
                </div>
              </div>
            </div>
            <Button type="submit" className={styles.submitButton}>
              Save Changes
            </Button>
          </form>
        </div>
      </Dialog>
    </>
  );
}
