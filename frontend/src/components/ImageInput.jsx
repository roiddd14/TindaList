import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  Image,
  VStack,
  Center,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";

function ImageInput({ value, onChange, error }) {
  const [tab, setTab] = useState(0);
  const [preview, setPreview] = useState(value || "");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result;
      onChange(base64);
      setPreview(base64);
    };

    reader.readAsDataURL(file);
  };

  return (
    <FormControl isInvalid={error}>
      <FormLabel fontWeight="semibold">Product Image</FormLabel>

      <Tabs index={tab} onChange={setTab} variant="soft-rounded" colorScheme="blue">
        <TabList mb={4}>
          <Tab>Image URL</Tab>
          <Tab>Upload File</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Input
              placeholder="Paste image URL"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setPreview(e.target.value);
              }}
            />
          </TabPanel>

          <TabPanel>
            <VStack spacing={4}>
              <Input type="file" accept="image/*" onChange={handleFileChange} />

              <Button size="sm" onClick={() => { onChange(""); setPreview(""); }}>
                Clear Image
              </Button>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {preview && (
        <Center mt={4}>
          <Image
            src={preview}
            alt="Product Preview"
            boxSize="150px"
            objectFit="cover"
            rounded="md"
            shadow="md"
            border="1px solid"
            borderColor="gray.300"
          />
        </Center>
      )}

      <FormErrorMessage>Image is required.</FormErrorMessage>
    </FormControl>
  );
}

export default ImageInput;
