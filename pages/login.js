import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { useAuth } from '../lib/firebaseAuth';
import { Stack, TextInput, PasswordInput, Button, Group, Box, Collapse, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { AiOutlineRight } from 'react-icons/ai';
import { GoAlert } from 'react-icons/go';

export default function Home() {
  const { authUser, loading, signInWithEmail } = useAuth();
  const router = useRouter();
  useEffect(() => {
      if (!loading) {
          if (authUser) {
              router.replace('/');
          }
      }
  }, [loading]);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });
  const [signInLoading, setSignInLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  useEffect(() => {
    if (loginError) {
      form.setErrors({ email: ' ', password: ' ' });
      setSignInLoading(false);
    }
    else {
      form.clearErrors();
    }
  }, [loginError]);

  return (
    <Box sx={{ maxWidth: 300 }} mx="auto">
      {/* <Tooltip
        gutter={0}
        opened={loginError}
        label="Either incorrect email or password!"
        position='bottom'
        transition="slide-up"
        transitionDuration={300} transitionTimingFunction="ease" color="red"
        withArrow
      > */}
        <form onChange={() => {
            setLoginError(false);
          }}
          onSubmit={form.onSubmit((values) => {
            setLoginError(false);
            setSignInLoading(true);
            signInWithEmail(values.email, values.password, () => {
              setLoginError(false);
            }, () => {
              setLoginError(true);
            });
          })}>
          <Stack spacing='lg' >
            <TextInput
              required
              label="Email"
              placeholder="Type here"
              {...form.getInputProps('email')}
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Type here"
              {...form.getInputProps('password')}
            />
          </Stack>
          <Group position="right" mt="md">
              <Button type="submit" leftIcon={<AiOutlineRight size={14} />} loading={signInLoading} >Submit</Button>
          </Group>
        </form>
        <Collapse in={loginError} >
          <Alert icon={<GoAlert />} title="Incorrect email or password!" color="red">
          </Alert>
        </Collapse>
    </Box>
  )
}
