import { Stack, Text } from '@mantine/core';
import Link from 'next/link'

export default function Home() {

  return (
    <Stack>
      <Text>
        Welcome to the admin system for Aeyon.
        <br />
        Here you can:
        <ul>
          <li>
            <Link href='products' >
              Add/Edit/Remove products
            </Link>
          </li>
          <li>
            <Link href='map' >
              Monitor trolleys
            </Link>
          </li>
          <li>
            <Link href='customer_support' >
              Attend to customer support requests
            </Link>
          </li>
        </ul>
      </Text>
    </Stack>
  )
}
