import React, { useState } from 'react';
import { VaultItem } from '../types';

interface SecretVaultProps {
  items: VaultItem[];
  onAdd: (key: string, value: string) => void;
}

export const SecretVault: React.FC<SecretVaultProps> = ({ items, onAdd }) => {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);

  // Helper to get or create a device-specific master key
  const getDeviceMasterKey = async (): Promise<CryptoKey> => {
    let rawKeyData = localStorage.getItem('shipit_vault_device_key');
    let rawBytes: Uint8Array;

    if (rawKeyData) {
      const binary = atob(rawKeyData);
      rawBytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        rawBytes[i] = binary.charCodeAt(i);
      }
    } else {
      rawBytes = window.crypto.getRandomValues(new Uint8Array(32)); // 256-bit random key
      const binary = String.fromCharCode(...rawBytes);
      localStorage.setItem('shipit_vault_device_key', btoa(binary));
    }

    return window.crypto.subtle.importKey(
      "raw",
      rawBytes,
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );
  };

  // Client-side encryption using dynamic device key
  const encryptValue = async (plainText: string): Promise<string> => {
    try {
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encodedText = new TextEncoder().encode(plainText);

      const keyMaterial = await getDeviceMasterKey();

      const key = await window.crypto.subtle.deriveKey(
        {
           name: "PBKDF2",
           salt: new TextEncoder().encode("SHIPIT_VAULT_SALT"), // Salt can remain static for this architecture
           iterations: 100000,
           hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt"]
      );

      const encryptedData = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encodedText
      );

      // Combine IV and data for storage
      const buffer = new Uint8Array(iv.byteLength + encryptedData.byteLength);
      buffer.set(iv);
      buffer.set(new Uint8Array(encryptedData), iv.byteLength);

      // Return as Base64 string
      return btoa(String.fromCharCode(...buffer));
    } catch (e) {
      console.error("Encryption failed", e);
      return "";
    }
  };

  const handleAddSecret = async () => {
    if (newKey && newValue) {
      setIsEncrypting(true);
      // Simulate a small delay for UX so user sees the "Encrypting" state
      await new Promise(r => setTimeout(r, 600));
      
      const encryptedValue = await encryptValue(newValue);
      
      if (encryptedValue) {
        onAdd(newKey, `enc_aes256$${encryptedValue}`);
        setNewKey('');
        setNewValue('');
        setShowAdd(false);
      }
      setIsEncrypting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Secure Secret Vault</h4>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          {showAdd ? 'Cancel' : '+ Add Secret'}
        </button>
      </div>

      {showAdd && (
        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 animate-slide-in">
          <div className="grid gap-3">
            <input 
              type="text" 
              placeholder="e.g. STRIPE_API_KEY"
              className="w-full px-3 py-2 text-sm rounded-lg border border-indigo-200 outline-none"
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Paste value here..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-indigo-200 outline-none"
              value={newValue}
              onChange={e => setNewValue(e.target.value)}
            />
            <button 
              onClick={handleAddSecret}
              disabled={isEncrypting || !newKey || !newValue}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-70 transition-all"
            >
              {isEncrypting ? (
                <>
                  <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Encrypting & Storing...
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Encrypt & Share
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-center py-8 text-xs text-slate-400 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            No secrets shared yet. Add keys like OpenAI, Stripe, or DB URL.
          </p>
        ) : (
          items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">{item.key}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {item.value.startsWith('enc_') ? 'AES-GCM ENCRYPTED' : '••••••••••••••••'}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded">Shared</span>
            </div>
          ))
        )}
      </div>
      <p className="text-[10px] text-slate-400 leading-relaxed italic text-center">
        ShipIt Vault uses device-local AES-256 encryption. Secrets are encrypted with a key unique to this device before storage.
      </p>
    </div>
  );
};