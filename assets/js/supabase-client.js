// ==========================================================================
// ODDAWORLD - Supabase Cloud Backend Integration
// ==========================================================================

const SUPABASE_CONFIG = {
  url: 'https://xqrvcalstmxzmpfzmbfq.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxcnZjYWxzdG14em1wZnptYmZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5MjI3NTAsImV4cCI6MjEwNTQ5ODc1MH0.BmOpdA_CXYrVdT2bIPqgWG-XLX85fwul69ktiksmSRE',
  publishableKey: 'sb_publishable_Xeu4_vAfrXE0PkEGVnMT6w_Si2O4JKA'
};

class SupabaseService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.init();
  }

  init() {
    if (typeof supabase !== 'undefined' && supabase.createClient) {
      try {
        this.client = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true
          }
        });
        window.supabaseClient = this.client;
        console.log('🌿 Supabase Client initialized successfully for ODDAWORLD.');
        this.checkConnection();
      } catch (err) {
        console.error('Failed to initialize Supabase client:', err);
      }
    } else {
      console.warn('Supabase SDK not loaded yet. Retrying in 500ms...');
      setTimeout(() => this.init(), 500);
    }
  }

  async checkConnection() {
    if (!this.client) return false;
    try {
      const startTime = performance.now();
      const { data, error } = await this.client
        .from('products')
        .select('id')
        .limit(1);

      if (error) {
        console.warn('Supabase ping warning:', error.message);
        this.isConnected = false;
        this.updateStatusBadge(false);
        return false;
      }

      this.isConnected = true;
      const latency = Math.round(performance.now() - startTime);
      console.log(`✓ Supabase connected & healthy (${latency}ms)`);
      this.updateStatusBadge(true, latency);
      return true;
    } catch (e) {
      console.warn('Supabase offline or unreachable:', e);
      this.isConnected = false;
      this.updateStatusBadge(false);
      return false;
    }
  }

  updateStatusBadge(connected, latency = null) {
    const badge = document.getElementById('supabase-status-badge');
    if (badge) {
      if (connected) {
        badge.innerHTML = `<span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#4CAF50; margin-right:6px; box-shadow: 0 0 8px #4CAF50;"></span> Supabase Cloud Sync : Actif ${latency ? `(${latency}ms)` : ''}`;
        badge.style.color = '#A5D6A7';
      } else {
        badge.innerHTML = `<span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#FF9800; margin-right:6px;"></span> Mode Local (Hors-Ligne)`;
        badge.style.color = '#FFE082';
      }
    }
  }

  // --- 1. ORDERS ---
  async createOrder(orderPayload) {
    if (!this.client) {
      console.warn('Supabase not available, order stored locally.');
      return { success: false, mode: 'local' };
    }

    try {
      const orderRow = {
        id: orderPayload.id,
        customer_name: `${orderPayload.firstName || ''} ${orderPayload.lastName || ''}`.trim() || 'Client ODDAWORLD',
        customer_email: orderPayload.email || '',
        customer_phone: orderPayload.phone || '',
        delivery_address: orderPayload.address || '',
        delivery_country: orderPayload.country || 'France',
        items: orderPayload.items || [],
        subtotal: Number(orderPayload.subtotal || orderPayload.total || 0),
        shipping_cost: Number(orderPayload.shippingCost || 0),
        total: Number(orderPayload.total || 0),
        payment_method: orderPayload.paymentMethod || 'card',
        promo_code: orderPayload.appliedPromo || null,
        status: 'processing'
      };

      const { data, error } = await this.client
        .from('orders')
        .insert([orderRow])
        .select();

      if (error) {
        console.error('Error inserting order into Supabase:', error);
        return { success: false, error: error.message };
      }

      console.log('✓ Order synced to Supabase Cloud:', orderPayload.id);
      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error creating order in Supabase:', err);
      return { success: false, error: err.message };
    }
  }

  // --- 2. NEWSLETTER ---
  async subscribeNewsletter(email, source = 'website_popup') {
    if (!this.client) return { success: false };

    try {
      const cleanEmail = (email || '').trim().toLowerCase();
      if (!cleanEmail) return { success: false, error: 'Email requis' };

      const { data, error } = await this.client
        .from('newsletter_subscribers')
        .insert([{ email: cleanEmail, source }])
        .select();

      if (error) {
        // Unique violation code 23505 means already subscribed
        if (error.code === '23505') {
          console.log('Email already subscribed to newsletter:', cleanEmail);
          return { success: true, alreadySubscribed: true };
        }
        console.error('Error subscribing to newsletter in Supabase:', error);
        return { success: false, error: error.message };
      }

      console.log('✓ Newsletter subscriber saved to Supabase:', cleanEmail);
      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error subscribing to newsletter:', err);
      return { success: false, error: err.message };
    }
  }

  // --- 3. CONTACT FORM ---
  async sendContactMessage({ name, email, subject, message }) {
    if (!this.client) return { success: false };

    try {
      const { data, error } = await this.client
        .from('contact_messages')
        .insert([{
          name: name.trim(),
          email: email.trim(),
          subject: subject || 'Demande client',
          message: message.trim()
        }])
        .select();

      if (error) {
        console.error('Error saving contact message to Supabase:', error);
        return { success: false, error: error.message };
      }

      console.log('✓ Contact message recorded in Supabase');
      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error in contact submission:', err);
      return { success: false, error: err.message };
    }
  }

  // --- 4. SKIN QUIZ DIAGNOSIS ---
  async saveQuizDiagnosis(diagnosisPayload) {
    if (!this.client) return { success: false };

    try {
      const { data, error } = await this.client
        .from('quiz_diagnoses')
        .insert([{
          skin_type: diagnosisPayload.skinType,
          concern: diagnosisPayload.concern,
          answers: diagnosisPayload.answers || {},
          recommended_bundle: diagnosisPayload.recommendedBundle || []
        }])
        .select();

      if (error) {
        console.error('Error saving quiz diagnosis to Supabase:', error);
        return { success: false, error: error.message };
      }

      console.log('✓ Quiz diagnosis saved to Supabase');
      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error saving quiz diagnosis:', err);
      return { success: false, error: err.message };
    }
  }

  // --- 5. PRODUCTS SYNC ---
  async fetchProducts() {
    if (!this.client) return null;
    try {
      const { data, error } = await this.client
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.warn('Error fetching products from Supabase:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn('Failed to fetch products from Supabase:', err);
      return null;
    }
  }
}

// Global Supabase Service Instance
const supabaseService = new SupabaseService();
window.supabaseService = supabaseService;