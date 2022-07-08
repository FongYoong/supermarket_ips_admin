import { useState, useEffect } from 'react'
import { Stack, Text, Loader, TextInput, NumberInput, Button, Group, NativeSelect, Modal, Stepper, Collapse, Alert, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { getCloudinarySignature, uploadImages, addProduct, editProduct } from '../lib/clientDb'
import SupermarketMap from '../components/map/SupermarketMap';
import { productCategories } from '../lib/supermarket_products'
import { AiOutlineRight } from 'react-icons/ai'
import { ImCross, ImCheckmark } from 'react-icons/im'
import { IoMdImages } from 'react-icons/io'
import { BsPencilSquare } from 'react-icons/bs'
import { BiMapPin } from 'react-icons/bi'

// File Pond
import { FilePond, registerPlugin } from 'react-filepond'; // Import React FilePond
import 'filepond/dist/filepond.min.css'; // Import FilePond styles
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateSize, FilePondPluginFileValidateType);

const filepondServerConfig = {
    load: (source, load, error, progress, abort, headers) => {
        let myRequest = new Request(source);
        fetch(myRequest).then(function(response) {
            response.blob().then(function(myBlob) {
            load(myBlob)
            });
        });
    },
}

const isInvalidName = (value) => {
    return value.length <= 0 || /^\s+$/.test(value);
}

const isInvalidNumber = (value) => {
    return value === undefined;
}

function ProductEditModal({show, setShow, onSuccess, edit=false, initialData}) {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [formIndex, setFormIndex] = useState(0);
    const form = useForm({
        initialValues: {
          name: '',
          quantity: 0,
          price: 0,
          category: 'Dairy',
        },
        validate: {
            name: (value) => isInvalidName(value) ? 'Invalid name' : null,
        },
    });
    const [mapPin, setMapPin] = useState(null);
    const [imageFiles, setImageFiles] = useState([]);
    const invalidForm = isInvalidName(form.values.name) || isInvalidNumber(form.values.quantity) || isInvalidNumber(form.values.price);
    const invalidMapPin = mapPin === null;
    const invalidImage = imageFiles.length <= 0;
    const invalidSubmit = invalidForm || invalidMapPin || invalidImage;

    const reset = () => {
        setFormIndex(0);
        form.reset();
        setMapPin(null);
        setImageFiles([]);
        setUploading(false);
        setUploadProgress(0);
    }

    useEffect(() => {
        if (edit && initialData) {
            setFormIndex(0);
            setUploading(false);
            setUploadProgress(0);
            form.setValues({
                name: initialData.name,
                quantity: initialData.quantity,
                price: initialData.price,
                category: initialData.category,
            })
            if (initialData.mapPin) {
                setMapPin(initialData.mapPin)
            }
            else {
                setMapPin(null);
            }
            setImageFiles([{
                source: initialData.imageUrl.replace('http://','https://'),
                options: {
                    type: "local"
                }
            }]);
        }
        else {
            reset();
        }
    }, [show, edit, initialData])

    const uploadProduct = () => {
        setUploading(true);
        getCloudinarySignature((credentials) => {
            console.log(credentials);
            uploadImages(credentials, imageFiles,
                (progressValue) => {
                    setUploadProgress(progressValue / 100 * 95);
                },
                (imageUrls) => {
                    console.log('Uploaded images');
                    console.log(imageUrls);
                    addOrEditProductInFirebase(imageUrls[0]);
                }
            )
        });
    }
    
    const addOrEditProductInFirebase = (imageUrl) => {
        const data = {
            ...form.values,
            mapPin,
            imageUrl,
        };
        const successHandler = () => {
            console.log("Firebase Success");
            const message = `Name: ${form.values.name}, Quantity: ${form.values.quantity}, Price: RM ${form.values.price.toFixed(2)}`;
            if (edit) {
                showNotification({
                    title: `Edited ${form.values.category} product!`,
                    message,
                    autoClose: 4000
                });
            }
            else {
                showNotification({
                    title: `Added ${form.values.category} product!`,
                    message,
                    autoClose: 4000
                });
            }

            reset();
            onSuccess();
        };
        const errorHandler = () => {
            alert("Firebase Error");
        };
        if (edit) {
            editProduct(initialData.id, data, successHandler, errorHandler);
        }
        else {
            addProduct(data, successHandler, errorHandler);
        }
    }

    return (
        <Modal
            size='lg'
            opened={show}
            onClose={() => setShow(false)}
            title={edit ? 'Edit Product' : 'Add Product'}
            closeOnClickOutside={!uploading}
            closeOnEscape={!uploading}
            transition="slide-up"
            transitionDuration={300}
            transitionTimingFunction="ease"
        >
            <LoadingOverlay visible={uploading} 
                loader={
                    <Alert icon={<Loader />} title={`${Math.round(uploadProgress)}%`} color="purple">
                    </Alert>
                }

            />
            <Stepper active={formIndex} onStepClick={setFormIndex} orientation="horizontal" breakpoint="sm" mr={20} >
                <Stepper.Step color={invalidForm ? "red" : "green"}
                    icon={<BsPencilSquare />} completedIcon={invalidForm ? <ImCross /> : <ImCheckmark />}
                    label="Fill up" description="Details"
                >
                    <form onChange={() => {

                    }}
                        onSubmit={form.onSubmit((values) => {
                            setFormIndex(1);
                        })}>
                        <Stack spacing='lg' >
                            <TextInput
                                required
                                label="Product Name"
                                placeholder="Type here"
                                {...form.getInputProps('name')}
                            />
                            <NumberInput
                                required
                                label="Quantity"
                                placeholder="Type here"
                                min={0}
                                {...form.getInputProps('quantity')}
                            />
                            <NumberInput
                                required
                                label="Price"
                                placeholder="Type here"
                                icon={<Text size='sm' weight={500} >RM</Text>}
                                min={0}
                                step={0.05}
                                precision={2}
                                {...form.getInputProps('price')}
                            />
                            <NativeSelect
                                required
                                data={productCategories.map((cat) => cat.name)}
                                placeholder="Pick one"
                                label="Product Category"
                                {...form.getInputProps('category')}
                            />
                        </Stack>
                        <Group position="right" mt="md">
                            <Button type="submit" leftIcon={<AiOutlineRight size={14} />} color={invalidForm ? "red" : "green"} variant={invalidForm ? 'outline': 'filled'} >
                                Next
                            </Button>
                        </Group>
                    </form>
                </Stepper.Step>
                <Stepper.Step color={invalidMapPin ? "red" : "green"}
                    icon={<BiMapPin />} completedIcon={invalidMapPin ? <ImCross /> : <ImCheckmark />}
                    label="Map" description="Position"
                >
                    <Group position="center" mt="md" mb='sm' spacing='xs' >
                        <Text color="dimmed" >
                            Category:
                        </Text>
                        <Text weight={800} >{form.values.category}</Text>
                    </Group>
                    <SupermarketMap
                        style={{
                            width: '100%',
                            height: '50vh'
                        }}
                        showGrid
                        editGrid
                        enableShelfSelect={false}
                        categories={[form.values.category]}
                        initialSelectedGridPoint={mapPin}
                        onGridClick={(value) => {
                            setMapPin(value);
                        }}
                    />
                    <Group position="right" mt="md">
                        <Button leftIcon={<AiOutlineRight size={14} />} color={invalidMapPin ? "red" : "green"} variant={invalidMapPin ? 'outline': 'filled'}
                            onClick={() => {
                                setFormIndex(2);
                            }}
                        >
                            Next
                        </Button>
                    </Group>
                </Stepper.Step>
                <Stepper.Step color={invalidImage > 0 ? "red" : "green"} icon={<IoMdImages />} loading={uploading}
                    label="Upload" description="Image">
                        <FilePond
                            server={filepondServerConfig}
                            allowProcess={false}
                            files={imageFiles}
                            onupdatefiles={(files) => {
                                if (files.length > 0) {
                                    if (typeof files[0].source == 'string') {
                                        setImageFiles([{
                                            source: files[0].source,
                                            options: {
                                                type: "local"
                                            }
                                        }])
                                    }
                                    else {
                                        setImageFiles(files);
                                    }
                                }
                                else {
                                    setImageFiles([])
                                }
                            }}
                            instantUpload={false}
                            acceptedFileTypes={['image/*']}
                            labelFileTypeNotAllowed='Only images are allowed'
                            fileValidateTypeLabelExpectedTypes=""
                            allowMultiple={true}
                            allowReorder={true}
                            maxFiles={1}
                            maxFileSize='10MB'
                            name="image"
                            labelIdle='Drag & Drop your image here or <span class="filepond--label-action">Browse</span>'
                            credits={{}}
                        />
                        {/* <Collapse in={uploading} >
                            <Alert icon={<AiOutlineRight />} title={`${uploadProgress}%`} color="purple">
                            </Alert>
                        </Collapse> */}
                    <Group position="right" mt="md">
                        <Button leftIcon={<AiOutlineRight size={14} />} color={invalidSubmit ? "red" : "green"} variant={invalidSubmit ? 'outline': 'filled'} 
                                onClick={() => {
                                    if (!invalidSubmit) {
                                        uploadProduct();
                                    }
                                }}
                        >
                            Submit
                        </Button>
                    </Group>
                </Stepper.Step>
                <Stepper.Completed>
                </Stepper.Completed>
            </Stepper>
        </Modal>
    )
}
export default ProductEditModal;