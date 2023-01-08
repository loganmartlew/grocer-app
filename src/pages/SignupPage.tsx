import { FC } from 'react';
import {
  Center,
  Stack,
  Title,
  TextInput,
  Text,
  Button,
  Divider,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import TextLink from '~/components/TextLink';
import { GoogleButton, FacebookButton } from '~/components/SocialButtons';
import { supabase } from '~/lib/supabaseClient';

const signupSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string(),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const LoginPage: FC = () => {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: zodResolver(signupSchema),
  });

  const submit = async (values: SignupFormValues) => {
    if (values.password !== values.confirmPassword) {
      form.setFieldError('confirmPassword', 'Passwords do not match');
      return;
    }

    const auth = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });

    if (auth.error) {
      console.error(auth.error);
      return;
    }

    const { user, session } = auth.data;

    if (!user) {
      console.error('No user');
      return;
    }

    const { error } = await supabase.from('profile').insert({
      firstName: values.firstName,
      lastName: values.lastName,
      userId: user.id,
    });

    if (error) {
      console.error(error);
      return;
    }

    if (session) {
      navigate('/');
    } else {
      navigate('/confirmemail');
    }
  };

  return (
    <Center sx={{ minHeight: '100vh' }}>
      <Stack>
        <Title order={1}>Grocer</Title>
        <form onSubmit={form.onSubmit(submit)}>
          <Stack sx={{ width: 'min(90vw, 350px)' }}>
            <Title order={2}>Sign up</Title>
            <TextInput
              label='First Name'
              placeholder='Your first name'
              withAsterisk
              {...form.getInputProps('firstName')}
            />
            <TextInput
              label='Last Name'
              placeholder='Your last name'
              withAsterisk
              {...form.getInputProps('lastName')}
            />
            <TextInput
              label='Email'
              placeholder='Your email address'
              withAsterisk
              {...form.getInputProps('email')}
            />
            <TextInput
              type='password'
              label='Password'
              placeholder='Your password'
              withAsterisk
              {...form.getInputProps('password')}
            />
            <TextInput
              type='password'
              label='Confirm Password'
              placeholder='Re-enter your password'
              withAsterisk
              {...form.getInputProps('confirmPassword')}
            />
            <Button type='submit'>Sign up</Button>
            {/* <Divider label='OR' labelPosition='center' />
          <GoogleButton>Login with Google</GoogleButton>
          <FacebookButton>Login with Facebook</FacebookButton> */}
          </Stack>
        </form>
        <Text fz='sm' sx={{ display: 'flex', marginInline: 'auto' }}>
          Already have an account?
          <TextLink type='router' to='/signup' sx={{ marginLeft: '0.6ch' }}>
            Login
          </TextLink>
        </Text>
      </Stack>
    </Center>
  );
};

export default LoginPage;
