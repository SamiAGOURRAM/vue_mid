<template>
  <div class="bg-[#1A1A1B] min-h-screen flex flex-col">
    <Navbar />
    <div class="flex-grow container mx-auto px-4 py-8">
      <div class="max-w-3xl mx-auto bg-[#1A1A1B] p-6 rounded-lg shadow-lg border border-[#343536]">
        <h2 class="text-2xl font-bold text-center mb-6 text-[#D7DADC]">Create a New Event</h2>

        <form @submit.prevent="createevent" class="space-y-6">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-[#D7DADC]">Title</label>
              <input
                v-model="event.title"
                required
                type="text"
                class="mt-1 px-3 py-2 w-full bg-[#272729] text-[#D7DADC] border border-[#343536] rounded focus:outline-none focus:ring-2 focus:ring-[#FF4500]"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#D7DADC]">Free</label>
              <select
                v-model="event.type"
                required
                @change="updatePriceInput(this.value)"
                class="mt-1 px-3 py-2 w-full bg-[#272729] text-[#D7DADC] border border-[#343536] rounded focus:outline-none focus:ring-2 focus:ring-[#FF4500]"
              >
              <option value="False">False</option>
              <option value="True">True</option>
              </select>
            </div>
          </div>

          <!-- Date -->

          <div>
            <label class="block text-sm font-medium text-[#D7DADC]">Date</label>
            <input
        v-model="event.date"
        type="date"
        placeholder="date"
        class="w-24 px-3 py-2 bg-[#272729] text-[#D7DADC] border border-[#343536] rounded"
        required
      />
          </div>


          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-[#D7DADC]">Description</label>
            <textarea
              v-model="event.description"
              required
              class="mt-1 px-3 py-2 w-full bg-[#272729] text-[#D7DADC] border border-[#343536] rounded"
              rows="3"
            ></textarea>
          </div>

          <!-- Price -->

          <div>
            <label class="block text-sm font-medium text-[#D7DADC]">Price</label>
            <input
            id="price"
        v-model="event.price"
        type="number"
        placeholder="Price"
        class="w-24 px-3 py-2 bg-[#272729] text-[#D7DADC] border border-[#343536] rounded"
        required
      />
          </div>


          <!-- Image Upload -->
          <div>
            <label class="block text-sm font-medium text-[#D7DADC]">Event Image</label>
            <input
              type="file"
              @change="handleImageUpload"
              accept="image/*"
              class="mt-1 w-full text-[#D7DADC]"
            />
            <img v-if="imagePreview" :src="imagePreview" class="mt-2 max-w-xs rounded" />
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              class="w-full px-4 py-2 bg-[#FF4500] text font-semibold rounded hover:bg-opacity-90"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { db, auth, storage } from "../../firebase";
import Navbar from "@/components/Layout/NavBar.vue";
import { useRouter } from 'vue-router'; 


export default {
  components: { Navbar },
  setup() {
    const router = useRouter();
    const event = ref({
      title: "",
      description: "",
      type: "",
      yesVotes:0, 
      noVotes : 0,
      tags: [],
      imageUrl: "",
    });

    const votes = ref([]);
    // const diets = ref([]);
    const tagInput = ref("");
    const imagePreview = ref(null);
    const imageFile = ref(null);

    onMounted(async () => {
      // Fetch ingredients and diets from Firestore
      const [votesSnap] = await Promise.all([
        db.collection('votes').get()
      ]);

      votes.value = votesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

    });


    const updatePriceInput = () =>{
      const type = event.value.type; 
      const priceInput = document.getElementById("price")
      if(type === 'True'){
        event.value.price = 0; 
        priceInput.value = 0;
        priceInput.disabled = true;
        
        
      }

    }

    const addTag = () => {
      const tag = tagInput.value.trim();
      if (tag && !event.value.tags.includes(tag)) {
        event.value.tags.push(tag);
        tagInput.value = "";
      }
    };

    const removeTag = (index) => {
      event.value.tags.splice(index, 1);
    };

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        imageFile.value = file;
        imagePreview.value = URL.createObjectURL(file);
      }
    };

    const createevent = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Must be logged in to create a event");

    let imageUrl = "";
    if (imageFile.value) {
      // Create a storage reference with a unique name for the image
      const storageRef = storage.ref(`events/${user.uid}/${Date.now()}_${imageFile.value.name}`);
      
      // Upload the image
      await storageRef.put(imageFile.value);
      
      // Get the download URL
      imageUrl = await storageRef.getDownloadURL();
    }
    const eventData = {
      ...event.value, // Spread existing event data
      imageUrl, // Add the image URL if it exists
      author: user.uid, // Set the author as the current user's ID
      createdAt: new Date(), // Set the creation timestamp
      updatedAt: new Date(), // Set the update timestamp
    };

    // Add the new event document to the Firestore collection
    await db.collection("events").add(eventData);

    // Navigate back to the home page or a desired route
    router.push("/"); 
  } catch (error) {
    console.error("Error creating event:", error);
    alert(error.message); // Notify the user of the error
  }
};


    return {
      event,
      tagInput,
      imagePreview,
      addTag,
      removeTag,
      handleImageUpload,
      updatePriceInput,
      createevent
    }
  }
};
</script>
