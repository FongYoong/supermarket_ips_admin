import { useState, useEffect } from 'react'
import { Stack, Loader, TextInput, NumberInput, Button, Group, NativeSelect, Modal, Stepper, Collapse, Alert, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { getCloudinarySignature, uploadImages, addProduct, editProduct } from '../lib/clientDb'
import { productCategories } from '../lib/constants'
import { AiOutlineRight } from 'react-icons/ai'
import { ImCross, ImCheckmark } from 'react-icons/im'
import { IoMdImages } from 'react-icons/io'
import { BsPencilSquare } from 'react-icons/bs'

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

function ProductModal({show, setShow, onSuccess, edit=false, initialData}) {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [formIndex, setFormIndex] = useState(0);
    const form = useForm({
        initialValues: {
          name: '',
          quantity: 0,
          category: 'Dairy',
        },
        validate: {
            name: (value) => isInvalidName(value) ? 'Invalid name' : null,
        },
    });
    const [imageFiles, setImageFiles] = useState([]);
    const invalidName = isInvalidName(form.values.name);
    const invalidImage = imageFiles.length <= 0;

    const reset = () => {
        setFormIndex(0);
        form.reset();
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
                category: initialData.category,
            })
            setImageFiles([{
                source: initialData.imageUrl,
                options: {
                    type: "local"
                }
            }]);
        }
        else {
            reset();
        }
    }, [edit, initialData])

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
            imageUrl,
        };
        const successHandler = () => {
            console.log("Firebase Success");
            if (edit) {
                showNotification({
                    title: `Edited ${form.values.category} product!`,
                    message: `Name: ${form.values.name}, Quantity: ${form.values.quantity}`,
                    autoClose: 4000
                });
            }
            else {
                showNotification({
                    title: `Added ${form.values.category} product!`,
                    message: `Name: ${form.values.name}, Quantity: ${form.values.quantity}`,
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
            editProduct(initialData.productId, data, successHandler, errorHandler);
        }
        else {
            addProduct(data, successHandler, errorHandler);
        }
    }

    return (
        <Modal
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
            <Stepper active={formIndex} onStepClick={setFormIndex} orientation="horizontal" mr={20} >
                <Stepper.Step color={invalidName ? "red" : "green"}
                    icon={<BsPencilSquare />} completedIcon={invalidName ? <ImCross /> : <ImCheckmark />}
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
                            <NativeSelect
                                required
                                data={productCategories.map((cat) => cat.name)}
                                placeholder="Pick one"
                                label="Product Category"
                                {...form.getInputProps('category')}
                            />
                        </Stack>
                        <Group position="right" mt="md">
                            <Button type="submit" leftIcon={<AiOutlineRight size={14} />} color={invalidName ? "red" : "green"} variant={invalidName ? 'outline': 'filled'} >
                                Next
                            </Button>
                        </Group>
                    </form>
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
                        <Button leftIcon={<AiOutlineRight size={14} />} color={invalidName || invalidImage ? "red" : "green"} variant={invalidName || invalidImage ? 'outline': 'filled'} 
                                onClick={() => {
                                    if (!invalidName && !invalidImage) {
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
export default ProductModal;