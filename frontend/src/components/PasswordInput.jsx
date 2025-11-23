import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Progress,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const getStrength = (password) => {
  let score = 0;

  if (password.length > 5) score++;
  if (password.length > 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score;
};

const strengthMap = [
  { label: "Very Weak", color: "red.400", value: 20 },
  { label: "Weak", color: "orange.400", value: 40 },
  { label: "Medium", color: "yellow.400", value: 60 },
  { label: "Strong", color: "green.400", value: 80 },
  { label: "Very Strong", color: "teal.400", value: 100 },
];

export default function PasswordInput({
  label,
  value,
  onChange,
  placeholder = "Enter password",

  // NEW PROP
  showStrength = false,
}) {
  const [show, setShow] = useState(false);
  const score = getStrength(value || "");
  const strength = strengthMap[Math.min(score, 4)];

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>

      <InputGroup>
        <Input
          type={show ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />

        <InputRightElement>
          <IconButton
            size="sm"
            variant="ghost"
            aria-label="Toggle password visibility"
            icon={show ? <ViewOffIcon /> : <ViewIcon />}
            onClick={() => setShow(!show)}
          />
        </InputRightElement>
      </InputGroup>

      {/* Only show meter when showStrength = true */}
      {showStrength && value && (
        <VStack align="start" spacing={1} mt={2}>
          <Progress
            value={strength.value}
            w="100%"
            size="xs"
            colorScheme={strength.color.replace(".400", "")}
          />
          <Text fontSize="sm" color={strength.color}>
            {strength.label}
          </Text>
        </VStack>
      )}
    </FormControl>
  );
}
