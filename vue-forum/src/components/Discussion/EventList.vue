<template>
  <div class="bg-[#1A1A1B] text-[#D7DADC] min-h-screen">
    <header class="bg-[#1A1A1B] border-b border-[#343536] p-2 flex items-center justify-between">
      <div class="flex items-center">
        <h1 class="text-xl font-semibold">event Book</h1>
      </div>
      <div class="flex items-center">
        <input 
          v-model="searchQuery"
          @input="applyFilters"
          type="text" 
          placeholder="Search events..." 
          class="bg-[#272729] text-[#D7DADC] rounded-full px-4 py-1 mr-2 focus:outline-none focus:ring-2 focus:ring-[#D7DADC]"
        />
        <button @click="$router.push('/create-event')" class="bg-[#FF4500] text-white px-4 py-1 rounded-full hover:bg-opacity-80 mr-2">
          Create event
        </button>
        <button @click="$router.push('/login')" class="bg-[#FF4500] text-white px-4 py-1 rounded-full hover:bg-opacity-80">
          Log In
        </button>
      </div>
    </header>
    <div class="container mx-auto py-4 px-2">
      <div class="grid grid-cols-12 gap-4">
        <!-- Filter sidebar -->
        <div class="col-span-3 space-y-4">
          <div class="bg-[#1A1A1B] border border-[#343536] rounded-md p-4">
            <h3 class="text-lg font-semibold mb-4">Filters</h3>
            <div class="mb-6">
              <h4 class="text-sm font-medium mb-2">Event Preferences</h4>
            </div>
          </div>
        </div>
        <div class="col-span-9">
          <div v-if="!loading" class="space-y-4">
            <!-- No results message -->
            <div v-if="filteredevents.length === 0" class="text-center py-8">
              <p class="text-lg text-[#818384]">No events match your filters</p>
              <button
                @click="clearAllFilters"
                class="text-[#FF4500] hover:text-opacity-80 mt-2"
              >
                Clear all filters
              </button>
            </div>
            <div 
              v-else
              v-for="event in filteredevents" 
              :key="event.id"
              class="bg-[#1A1A1B] rounded-md border border-[#343536] p-4 hover:border-[#D7DADC]"
            >
              <div class="flex items-start">
                <img 
                  :src="event.imageUrl || '/placeholder-event.jpg'" 
                  alt="Event" 
                  class="w-24 h-24 object-cover rounded-md mr-4"
                />
                <div class="flex-grow">
                  <h3 @click="viewevent(event.id)" class="text-lg font-semibold mb-2 cursor-pointer hover:text-[#FF4500]">
                    {{ event.title }}
                  </h3>
                  <p class="text-sm text-[#818384] mb-2">
                    Posted by u/{{ event.username }} {{ formatTimeAgo(event.createdAt) }}
                  </p>
        <p class="text-sm text-[#818384] mb-2">
          Event Date: {{ formatEventDate(event.date) }}
        </p>
                  <p class="text-sm mb-2">{{ event.description }}</p>
                  <div class="flex items-center space-x-4 text-sm text-[#818384]">
                    <div class="flex items-center space-x-2">
                      <span class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {{ event.price }} DH
                      </span>
                    </div>
                    <!-- Voting buttons -->
                    <div class="flex items-center space-x-2">
                      <button
                        @click="handleVote(event.id, true)"
                        :disabled="!canVote(event) || hasVoted(event.id)"
                        :class="[
                          'px-3 py-1 rounded-full text-sm font-medium',
                          canVote(event) && !hasVoted(event.id)
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        ]"
                      >
                        Yes ({{ event.yesVotes || 0 }})
                      </button>
                      <button
                        @click="handleVote(event.id, false)"
                        :disabled="!canVote(event) || hasVoted(event.id)"
                        :class="[
                          'px-3 py-1 rounded-full text-sm font-medium',
                          canVote(event) && !hasVoted(event.id)
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        ]"
                      >
                        No ({{ event.noVotes || 0 }})
                      </button>
                    </div>
                    <div class="flex flex-wrap space-x-2">
                      <span
                        v-for="(tag, index) in event.tags"
                        :key="index"
                        class="bg-[#272729] text-[#D7DADC] px-2 py-1 rounded-lg text-xs"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading skeleton -->
          <div v-if="loading" class="space-y-4">
            <div v-for="i in 5" :key="i" class="bg-[#1A1A1B] rounded-md border border-[#343536] p-4 animate-pulse">
              <div class="flex">
                <div class="w-24 h-24 bg-[#343536] rounded-md mr-4"></div>
                <div class="flex-grow">
                  <div class="h-4 bg-[#343536] rounded w-3/4 mb-2"></div>
                  <div class="h-4 bg-[#343536] rounded w-1/2 mb-2"></div>
                  <div class="h-4 bg-[#343536] rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db, auth } from "../../firebase";

export default {
  data() {
    return {
      events: [],
      loading: true,
      searchQuery: "",
      filteredevents: [],
      userVotes: {},
      currentUser: null,
      selectedDiets: [],
      selectedServings: "",
      selectedIngredients: [],
      ingredientSearch: "",
      showIngredientDropdown: false,
      dietaryOptions: [],
      commonIngredients: [],
    };
  },
  computed: {
    hasActiveFilters() {
      return this.selectedDiets.length > 0 || 
        this.selectedServings !== "" || 
        this.selectedIngredients.length > 0 ||
        this.searchQuery.trim() !== "";
    },
    filteredIngredients() {
      if (!this.ingredientSearch) return this.commonIngredients;
      return this.commonIngredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(this.ingredientSearch.toLowerCase())
      );
    }
  },
  async created() {
    auth.onAuthStateChanged((user) => {
      this.currentUser = user;
      if (user) {
        this.loadUserVotes(user.uid);
      } else {
        this.userVotes = {};
      }
    });

    await this.loadEvents();
  },
  methods: {
    async loadEvents() {
      try {
        const snapshot = await db.collection("events")
          .orderBy("createdAt", "desc")
          .get();

        this.events = [];
        for (const doc of snapshot.docs) {
          const event = { id: doc.id, ...doc.data() };
          if (event.date && event.date.seconds) {
            event.date = new Date(event.date.seconds * 1000);
          }
          const userSnapshot = await db
            .collection("users")
            .doc(event.author)
            .get();
          
          event.username = userSnapshot.exists ? userSnapshot.data().name : "Unknown";
          this.events.push(event);
        }
        this.applyFilters();
        this.loading = false;
      } catch (error) {
        console.error("Error fetching events:", error);
        this.loading = false;
      }
    },

    async loadUserVotes(userId) {
      try {
        const votesSnapshot = await db
          .collection("votes")
          .where("userId", "==", userId)
          .get();
        
        const votes = {};
        votesSnapshot.forEach(doc => {
          votes[doc.data().eventId] = doc.data().vote;
        });
        this.userVotes = votes;
      } catch (error) {
        console.error("Error loading user votes:", error);
      }
    },

    canVote(event) {
      if (!this.currentUser) return false;
      if (!event.date) return false;
      const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
      const now = new Date();
      console.log('eevent date:', eventDate);
      console.log('current date:', now);
      console.log('can vote:', eventDate > now);
      
      return eventDate > now && !this.hasVoted(event.id);
    },

    hasVoted(eventId) {
      return eventId in this.userVotes;
    },

    async handleVote(eventId, voteValue) {
  if (!this.currentUser || this.hasVoted(eventId)) return;

  try {
    // Add vote to Firebase
    await db.collection("votes").add({
      userId: this.currentUser.uid,
      eventId: eventId,
      vote: voteValue,
      createdAt: new Date()
    });

    // Update vote counts in Firebase
    const eventRef = db.collection("events").doc(eventId);
    await db.runTransaction(async (transaction) => {
      const eventDoc = await transaction.get(eventRef);
      if (!eventDoc.exists) return;
      const eventData = eventDoc.data();
      const updates = {
        yesVotes: (eventData.yesVotes || 0) + (voteValue ? 1 : 0),
        noVotes: (eventData.noVotes || 0) + (voteValue ? 0 : 1)
      };
      transaction.update(eventRef, updates);
    });

    // Update local state
    this.userVotes[eventId] = voteValue;
    
    // Find and update the event in the local arrays
    const eventIndex = this.events.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
      // Create a new event object with updated vote counts
      const updatedEvent = {
        ...this.events[eventIndex],
        yesVotes: voteValue 
          ? (this.events[eventIndex].yesVotes || 0) + 1 
          : (this.events[eventIndex].yesVotes || 0),
        noVotes: !voteValue 
          ? (this.events[eventIndex].noVotes || 0) + 1 
          : (this.events[eventIndex].noVotes || 0)
      };
      
      // Update both arrays
      this.events[eventIndex] = updatedEvent;
      this.filteredevents = this.events.filter(event => 
        this.filteredevents.some(fe => fe.id === event.id)
      );
    }

    // No need to reload the page
    // window.location.reload();
  } catch (error) {
    console.error("Error handling vote:", error);
  }
}, 

    applyFilters() {
      let filtered = [...this.events];      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(event => 
          event.title.toLowerCase().includes(query) || 
          event.description.toLowerCase().includes(query) ||
          (event.tags && event.tags.some(tag => tag.toLowerCase().includes(query)))
        );
      }

      this.filteredevents = filtered;
    },
    formatEventDate(date) {
      if (!date) return "Date not specified";
      const eventDate = date instanceof Date ? date : new Date(date);
      return eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    formatTimeAgo(timestamp) {
      if (!timestamp) return "";
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      if (isNaN(date.getTime())) {
        return "";
      }

      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
      if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
      return `${Math.floor(diffInSeconds / 31536000)} years ago`;
    },

    viewevent(eventId) {
      this.$router.push(`/event/${eventId}`);
    },

    clearAllFilters() {
      this.searchQuery = "";
      this.selectedDiets = [];
      this.selectedServings = "";
      this.selectedIngredients = [];
      this.applyFilters();
    }
  }
};
</script>

    