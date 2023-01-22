import { useEffect } from 'react';
import { useStore } from '~/features/store';
import { useAuth } from '~/features/auth/useAuth';
import { getUserHouseholds, openUserHouseholdsChannel } from './householdApi';
import { supabase } from '~/lib/supabaseClient';

export const useHousehold = () => {
  const {
    households,
    currentHouseholdId,
    isLoading,
    setHouseholds,
    setCurrentHouseholdId,
    setIsLoading,
  } = useStore(s => s.household);

  const { user } = useAuth();

  const currentHousehold =
    households.find(household => household.id === currentHouseholdId) || null;

  useEffect(() => {
    if (!user) {
      setHouseholds([]);
      return;
    }

    getUserHouseholds(user.id).then(households => {
      setHouseholds(households);

      if (households.length > 0 && !currentHouseholdId) {
        setCurrentHouseholdId(households[0].id);
      }
    });

    const channel = openUserHouseholdsChannel(user.id, () => {
      getUserHouseholds(user.id).then(households => {
        setHouseholds(households);
      });
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    households,
    currentHousehold,
    isLoading,
    setHouseholds,
    setCurrentHouseholdId,
  };
};
