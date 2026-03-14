import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <Box minH="100vh" bg="gray.50" className="flex items-center justify-center px-4 py-8">
      <Box bg="white" rounded="2xl" shadow="md" w="full" maxW="430px" p={{ base: '6', md: '8' }}>
        <Heading size="lg">Login</Heading>
        <Text mt="2" color="gray.500">
          Simple apartment management
        </Text>

        <form onSubmit={onSubmit} className="space-y-4" style={{ marginTop: 16 }}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@apartment.com"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
            />
          </div>

          <Button type="submit" w="full" colorScheme="teal" size="lg">
            Sign In
          </Button>
        </form>
      </Box>
    </Box>
  );
}