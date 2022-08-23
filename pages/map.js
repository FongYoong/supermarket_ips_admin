import { useState, useRef } from 'react';
import { Stack, Group, Checkbox } from '@mantine/core';
import SupermarketMap from '../components/map/SupermarketMap';
import TrolleyStatusCard from '../components/map/TrolleyStatusCard';
import { useDatabaseSnapshot  } from "@react-query-firebase/database";
import { getTrolleysDataRef, toArray } from '../lib/clientDb';
import { stringToPhysicalCoordinates } from '../lib/supermarket_grid';
import { RaceBy } from '@uiball/loaders';
// import { trolleys } from '../lib/supermarket_trolleys';
// import { GrOverview } from 'react-icons/gr';

export default function Map() {

  const [showGrid, setShowGrid] = useState(false);
  const [showShelves, setShowShelves] = useState(true);

  const mapRef = useRef();

  // Trolleys
  const trolleysDataRef = getTrolleysDataRef();
  const trolleysDataQuery = useDatabaseSnapshot(["trolley_data"], trolleysDataRef,
  {
      subscribe: true,
  },
  {
      select: (result) => {
        const trolleysData = toArray(result).map((trolley) => {
          const coordinates = stringToPhysicalCoordinates(trolley.coordinates);
          return {
            ...trolley,
            coordinates,
            dateCreated: new Date(trolley.dateCreated)
          }
        });
        return trolleysData;
      },
  });

  const [selectedTrolleyData, setSelectedTrolleyData] = useState(undefined);


  return (
    <Stack>
        {/* <Text>This is a map component</Text> */}
        <Group>
          <Checkbox
            label="Show Grid"
            onChange={(e) => setShowGrid(e.currentTarget.checked)}
          />
          <Checkbox
            label="Show Shelves"
            checked={showShelves}
            onChange={(e) => setShowShelves(e.currentTarget.checked)}
          />
        </Group>
        <SupermarketMap
          ref={mapRef}
          style={{
            height: '50vh',
            flexGrow: 1
          }}
          showGrid={showGrid}
          showShelves={showShelves}
          trolleys={trolleysDataQuery.data}
          selectedTrolley={selectedTrolleyData} deselectTrolley={() => setSelectedTrolleyData(undefined)}
        />
        <Group>
          {trolleysDataQuery.isLoading &&
            <RaceBy
              style={{
                marginTop: 4
              }}
              size={80}
              lineWeight={5}
              speed={1.4} 
              color="black" 
            />
          }
          {trolleysDataQuery.isSuccess && trolleysDataQuery.data.map((data, index) => 
              <TrolleyStatusCard key={index} data={data}
                viewPastData={() => {
                  setSelectedTrolleyData(data)
                  mapRef.current.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
                }}
              />
          )}
        </Group>
    </Stack>
  )
}
