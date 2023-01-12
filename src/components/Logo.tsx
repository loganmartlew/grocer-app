import { Sx, Title, useMantineTheme } from '@mantine/core';
import { FC, useMemo } from 'react';

interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  sx?: Sx;
}

const Logo: FC<Props> = ({ size, sx }) => {
  const theme = useMantineTheme();

  const sizes = useMemo(
    () => ({
      xs: '1.5rem',
      sm: '2rem',
      md: '3rem',
      lg: '4rem',
      xl: '5rem',
    }),
    []
  );

  return (
    <Title
      order={1}
      color={theme.primaryColor}
      fz={sizes[size || 'sm']}
      sx={sx}
    >
      Grocer
    </Title>
  );
};

export default Logo;
