export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  travelers_count: number;
  trip_type: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ItineraryItem {
  id: string;
  trip_id: string;
  day_number: number;
  title: string;
  description: string;
  time: string;
  category: 'activity' | 'food' | 'transport' | 'accommodation';
  location: string;
  notes: string;
  order_index: number;
  created_at: string;
}

class LocalStorage {
  private getStorageKey(key: string): string {
    return `easytrip_${key}`;
  }

  private getData<T>(key: string): T[] {
    const data = localStorage.getItem(this.getStorageKey(key));
    return data ? JSON.parse(data) : [];
  }

  private setData<T>(key: string, data: T[]): void {
    localStorage.setItem(this.getStorageKey(key), JSON.stringify(data));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // User management
  createUser(email: string, password: string, fullName: string): User {
    const users = this.getData<User & { password: string }>('users');
    
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const user: User & { password: string } = {
      id: this.generateId(),
      email,
      password,
      fullName,
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    this.setData('users', users);

    // Set current user
    const { password: _, ...userWithoutPassword } = user;
    this.setCurrentUser(userWithoutPassword);
    
    return userWithoutPassword;
  }

  signIn(email: string, password: string): User {
    const users = this.getData<User & { password: string }>('users');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...userWithoutPassword } = user;
    this.setCurrentUser(userWithoutPassword);
    
    return userWithoutPassword;
  }

  signOut(): void {
    localStorage.removeItem(this.getStorageKey('currentUser'));
  }

  getCurrentUser(): User | null {
    const userData = localStorage.getItem(this.getStorageKey('currentUser'));
    return userData ? JSON.parse(userData) : null;
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem(this.getStorageKey('currentUser'), JSON.stringify(user));
  }

  // Trip management
  createTrip(tripData: Omit<Trip, 'id' | 'created_at' | 'updated_at'>): Trip {
    const trips = this.getData<Trip>('trips');
    
    const trip: Trip = {
      ...tripData,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    trips.push(trip);
    this.setData('trips', trips);
    
    return trip;
  }

  getTrips(userId: string): Trip[] {
    const trips = this.getData<Trip>('trips');
    return trips.filter(trip => trip.userId === userId);
  }

  getTrip(tripId: string): Trip | null {
    const trips = this.getData<Trip>('trips');
    return trips.find(trip => trip.id === tripId) || null;
  }

  updateTrip(tripId: string, updates: Partial<Trip>): Trip {
    const trips = this.getData<Trip>('trips');
    const index = trips.findIndex(trip => trip.id === tripId);
    
    if (index === -1) {
      throw new Error('Trip not found');
    }

    trips[index] = {
      ...trips[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    this.setData('trips', trips);
    return trips[index];
  }

  deleteTrip(tripId: string): void {
    const trips = this.getData<Trip>('trips');
    const filteredTrips = trips.filter(trip => trip.id !== tripId);
    this.setData('trips', filteredTrips);

    // Also delete related itinerary items
    const itineraryItems = this.getData<ItineraryItem>('itineraryItems');
    const filteredItems = itineraryItems.filter(item => item.trip_id !== tripId);
    this.setData('itineraryItems', filteredItems);
  }

  // Itinerary management
  createItineraryItem(itemData: Omit<ItineraryItem, 'id' | 'created_at'>): ItineraryItem {
    const items = this.getData<ItineraryItem>('itineraryItems');
    
    const item: ItineraryItem = {
      ...itemData,
      id: this.generateId(),
      created_at: new Date().toISOString(),
    };

    items.push(item);
    this.setData('itineraryItems', items);
    
    return item;
  }

  getItineraryItems(tripId: string): ItineraryItem[] {
    const items = this.getData<ItineraryItem>('itineraryItems');
    return items
      .filter(item => item.trip_id === tripId)
      .sort((a, b) => {
        if (a.day_number !== b.day_number) {
          return a.day_number - b.day_number;
        }
        return a.order_index - b.order_index;
      });
  }

  updateItineraryItem(itemId: string, updates: Partial<ItineraryItem>): ItineraryItem {
    const items = this.getData<ItineraryItem>('itineraryItems');
    const index = items.findIndex(item => item.id === itemId);
    
    if (index === -1) {
      throw new Error('Itinerary item not found');
    }

    items[index] = {
      ...items[index],
      ...updates,
    };

    this.setData('itineraryItems', items);
    return items[index];
  }

  deleteItineraryItem(itemId: string): void {
    const items = this.getData<ItineraryItem>('itineraryItems');
    const filteredItems = items.filter(item => item.id !== itemId);
    this.setData('itineraryItems', filteredItems);
  }
}

export const storage = new LocalStorage();