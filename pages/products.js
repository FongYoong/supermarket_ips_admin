import { useState, useEffect } from 'react';
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Box, Button, Text, Skeleton, Card, Group, Stack, Badge, MultiSelect, ActionIcon, TextInput, Divider, useMantineTheme } from '@mantine/core';
import { getProducts, detachProductListeners } from '../lib/clientDb'
import { productCategories } from '../lib/constants'
//import InfiniteScroll from 'react-infinite-scroll-component';
import { AiOutlinePlusSquare } from 'react-icons/ai';
import { FcAlphabeticalSortingAz, FcAlphabeticalSortingZa } from 'react-icons/fc';
import { FiClock } from 'react-icons/fi';

const ProductEditModal = dynamic(() => import('../components/ProductEditModal'))
const ProductDetailsModal = dynamic(() => import('../components/ProductDetailsModal'))
const ProductDeleteModal = dynamic(() => import('../components/ProductDeleteModal'))

const ProductCard = ({data, onDetails, onEdit, onDelete}) => {
  const [showOptions, setShowOptions] = useState(false);
  const theme = useMantineTheme();

  const productCategory = productCategories.find((cat) => cat.name == data.category);

  return (
      <Card shadow="sm" p="sm" withBorder sx={{
          display: 'flex',
          flexDirection: 'column',
          width: 150,
          minHeight: 200,
          transition: 'transform .2s',
          '&:hover': {
            transform: 'scale(1.05)'
          },
          cursor: 'pointer'
        }}
        onClick={() => setShowOptions(true)}
      >
        <Card.Section>
          {/* <Image src="./image.png" height={160} alt="Norway" /> */}
          <Box style={{
            position: 'relative',
            height: 84.375,
          }}>
            <Image src={data.imageUrl} alt={data.name} layout='fill' objectFit='cover' />
            <Text size="sm" style={{
              position: 'absolute',
              top: 0,
              right: 0,
              color: 'white',
              lineHeight: 1.5,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              padding: '0.2em',
            }}
            >
              {data.quantity > 0 ? `${data.quantity}` : 'Out of stock' }
            </Text>
          </Box>
        </Card.Section>
        <Text weight={500} style={{ marginBottom: 5, marginTop: theme.spacing.sm, }} 
        >
        {data.name}
        </Text>
        <div style={{flex: 2}}/>
        <Badge color={productCategory.color} variant="light">
          {data.category}
        </Badge>
        <Box tabIndex="0" onClick={(event) => {
            if(showOptions) {
              event.stopPropagation();
              setShowOptions(false);
            }
          }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            //paddingTop: '20%',
            top: 0,
            left: 0,
            transition: 'opacity 0.2s',
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            opacity: showOptions ? 1 : 0
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setShowOptions(false)
            }
          }}
        >
          <Stack spacing='0' >
            <Text p='xs' weight={700} >Last updated: {new Date(data.dateModified ? data.dateModified : data.dateCreated).toLocaleString('en-GB', { timeZone: 'UTC' }) }</Text>
            <Button color="green" size='xs' fullWidth onClick={() => {
              if(showOptions) {
                onDetails(data)
              }
            }} >
              View
            </Button>
            <Button color="blue" size='xs' fullWidth onClick={() => {
              if(showOptions) {
                onEdit(data)
              }
            }} >
              Edit
            </Button>
            <Button color="red" size='xs' fullWidth onClick={() => {
              if(showOptions) {
                onDelete(data)
              }
            }} >
              Delete
            </Button>
          </Stack>
          </Box>
      </Card>
  )
}

export default function Products() {
  const [searchName, setSearchName] = useState('');
  const [sortType, setSortType] = useState('dateModified');
  const [sortDescending, setSortDescending] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState([]);

  const [showProductEditModal, setShowProductEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editProduct, setEditProduct] = useState(false);
  const [initialProductData, setInitialProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [products, setProducts] = useState([]);
  //console.log(products)

  useEffect(() => {
    getProducts(true, (data) => {
      setLoading(false);
      if (data) {
        const formatted = Object.keys(data).map((productId) => {
          return {
            productId,
            ...data[productId]
          }
        });
        setOriginalProducts(formatted);
      }
      else {
        setOriginalProducts([]);
      }
    }, (error) => {
      setLoading(false);
      setOriginalProducts([]);
      console.error(`Fail: ${error}`);
    });
    return () => detachProductListeners();
  }, [])

  useEffect(() => {
    if (originalProducts) {
      const filtered = originalProducts.filter((prod) => {
        if (categoryFilter.length > 0 && !categoryFilter.includes(prod.category)) {
          return false;
        }
        if (searchName) {
          return prod.name.includes(searchName);
        }
        return true;
        
      });
      filtered.sort((a, b) => {
        if (sortType == 'alphabet') {
          return sortDescending ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
        }
        else if (sortType == 'dateModified') {
          return sortDescending ? b.dateModified - a.dateModified : a.dateModified - b.dateModified;
        }
      });
      setProducts(filtered);
    }
  }, [originalProducts, sortType, sortDescending, categoryFilter, searchName])

  const onDetails = (data) => {
    setShowDetailsModal(true);
    setInitialProductData(data);
  }

  const onEdit = (data) => {
    setEditProduct(true);
    setShowProductEditModal(true);
    setInitialProductData(data);
  }

  const onDelete = (data) => {
    setShowDeleteModal(true);
    setInitialProductData(data);
  }


  return (
    <Stack sx={{ maxWidth: '100%' }} mx="auto">
      <ProductEditModal edit={editProduct} initialData={initialProductData} show={showProductEditModal} setShow={setShowProductEditModal} onSuccess={() => {
        setShowProductEditModal(false);
      }} />
      <ProductDetailsModal data={initialProductData} show={showDetailsModal} setShow={setShowDetailsModal} />
      <ProductDeleteModal data={initialProductData} show={showDeleteModal} setShow={setShowDeleteModal} onSuccess={() => setShowDeleteModal(false)} />
      <Group position='left' align='flex-end' >
        <Button leftIcon={<AiOutlinePlusSquare size={24} />} color='green'
          onClick={() => {
            setEditProduct(false);
            setShowProductEditModal(true);
          }}
        >
          Add Product
        </Button>
      </Group>
      <Group position='left' align='flex-end' >
        <MultiSelect
          data={productCategories.map((cat) => {
            return {
              value: cat.name,
              label: cat.name
            }
          })}
          onChange={(value) => {
            setCategoryFilter(value);
          }}
          label="Categories"
          placeholder="None"
          clearable
        />
        <TextInput
            placeholder="Search by name"
            label="Name"
            value={searchName}
            onChange={(e) => setSearchName(e.currentTarget.value)}
        />
        <Group>
          <ActionIcon variant={sortType == 'alphabet' ? "outline":"hover"} color='violet'
            onClick={() => {
              if (sortType != 'alphabet') {
                setSortType('alphabet')
                setSortDescending(true)
              }
              else {
                setSortDescending(!sortDescending)
              }
            }}
          >
            {(sortDescending || sortType != 'alphabet') && <FcAlphabeticalSortingZa size={24} /> }
            {(!sortDescending && sortType == 'alphabet') && <FcAlphabeticalSortingAz size={24} />}
          </ActionIcon>
          <Button px={8} leftIcon={<FiClock size={14} />} variant={sortType == 'dateModified' ? "filled":"subtle"} color='violet'
            onClick={() => {
              if (sortType != 'dateModified') {
                setSortType('dateModified')
                setSortDescending(true)
              }
              else {
                setSortDescending(!sortDescending)
              }
            }}
          >
            {(sortDescending || sortType != 'dateModified') && <>Latest</>}
            {(!sortDescending && sortType == 'dateModified') && <>Oldest</>}
          </Button>
        </Group>
      </Group>
      <Divider />
      <Skeleton visible={loading} style={{width: '100%'}} >
        {/* <Text>Some table of products below</Text> */}
        <Group align='stretch' >
          {products.map((data, index) => <ProductCard key={index} data={data} onDetails={onDetails} onEdit={onEdit} onDelete={onDelete} />)}
        </Group>
      </Skeleton>
      
      {/* <InfiniteScroll
        dataLength={songsScrollData.length}
        next={fetchMoreSongs}
        hasMore={songsScrollData.length < songsData.length}
        loader={<Loader size='md' />}
        endMessage={
            isValidating ? null :
                <p style={{ textAlign: 'center' }}>
                <   b>You&apos;ve reached the end of this list. 😊</b>
                </p>
        }
        scrollableTarget="songsScrollableDiv"
        >
        {
            loading ?
            <Loader size='md' />
            :
            songsScrollData.map((song: any, index: number) => 
                <>
                    <SongRow key={song.id} rowData={song} index={index} oldestSessionDate={oldestSessionDate} />
                    <Divider />
                </>
            )
        }
      </InfiniteScroll> */}
    </Stack>
    
  )
}
