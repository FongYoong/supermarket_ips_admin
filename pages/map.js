import { useState } from 'react';
import { Stack, Checkbox, Button, Box, Text, MediaQuery } from '@mantine/core';
import SupermarketMap from '../components/map/SupermarketMap';
import { GrOverview } from 'react-icons/gr';

export default function Map() {

  const [showGrid, setShowGrid] = useState(false);

  return (
    <Stack>
        {/* <Text>This is a map component</Text> */}
        <Checkbox
          label="Show Grid"
          onChange={(e) => setShowGrid(e.currentTarget.checked)}
        />
        <SupermarketMap
          style={{
            height: '70vh'
          }}
          showGrid={showGrid}
        />
    </Stack>
  )
}
