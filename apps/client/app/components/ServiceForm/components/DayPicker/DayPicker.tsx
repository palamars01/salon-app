'use client';

import { Box, Checkbox, FormControl, FormGroup } from '@mui/material';

import styles from './dayPicker.module.scss';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface Props {
  availability: string[];
}

export function DayPicker({ availability }: Props) {
  return (
    <Box className={styles.container}>
      <FormControl component="fieldset" variant="standard" name="days">
        <FormGroup className={styles.group}>
          {days.map((day) => (
            <Checkbox
              key={day}
              id={day}
              name="availability"
              value={day}
              defaultChecked={availability.includes(day)}
              icon={<Box className={styles.dayItem}>{day}</Box>}
              checkedIcon={
                <Box className={`${styles.dayItem} ${styles.picked}`}>
                  {day}
                </Box>
              }
            />
          ))}
        </FormGroup>
      </FormControl>
    </Box>
  );
}
