import { defineStore } from "pinia";
import { ref } from 'vue';
import axios from 'axios';

export const useBadgeStore = defineStore('badge', () => {
  const badges = ref([]);
  
  const fetchBadges = async () => {
    try {
      const response = await axios.get('http://localhost:8080/member/badge/having/multiearlyer');
      badges.value = response.data.response.data.map(badge => ({
        id: badge.badgeNo,
        name: badge.name,
        imageUrl: badge.img,
        description: badge.desc,
        having: badge.having,
        main: badge.main
      }));
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  return {
    badges,
    fetchBadges
  };
});
