import React, { useState, useMemo } from "react";
import {
  View, Text, FlatList, SectionList, TextInput,
  TouchableOpacity, StyleSheet, SafeAreaView, Alert, StatusBar, ActivityIndicator
} from "react-native";

// 1. DATA PRODUK & KONTAK (Nama sudah diganti jadi Mutiara)
const ALL_PRODUCTS = [
  { id: 'f1', name: 'Syal Premium Wool Edition', category: 'Aksesoris', price: 250000, image: '🧣' },
  { id: 'f2', name: 'Ikat Pinggang Leather Brown', category: 'Aksesoris', price: 600000, image: 'ベルト' },
  { id: '1', name: 'Oversize T-Shirt White', category: 'Atasan', price: 150000, image: '👕' },
  { id: '2', name: 'Hoodie Midnight Black', category: 'Outerwear', price: 350000, image: '🧥' },
  { id: '3', name: 'Denim Jacket Vintage', category: 'Outerwear', price: 450000, image: '🧥' },
  { id: '4', name: 'Chino Pants Slim Fit', category: 'Bawahan', price: 275000, image: '👖' },
  { id: '5', name: 'Summer Floral Dress', category: 'Dress', price: 320000, image: '👗' },
  { id: '6', name: 'Leather Biker Jacket', category: 'Outerwear', price: 850000, image: '🧥' },
  { id: '7', name: 'Formal White Shirt', category: 'Atasan', price: 225000, image: '👔' },
  { id: '8', name: 'Cargo Pants Olive', category: 'Bawahan', price: 290000, image: '👖' },
  { id: '9', name: 'Sport Leggings Pro', category: 'Sportswear', price: 180000, image: '🩱' },
  { id: '10', name: 'Knit Cardigan Soft', category: 'Outerwear', price: 210000, image: '🧶' },
  { id: '11', name: 'Short Cargo Pants', category: 'Bawahan', price: 145000, image: '🩳' },
  { id: '12', name: 'Sweater Crewneck Grey', category: 'Outerwear', price: 195000, image: '👕' },
  { id: '13', name: 'Batik Modern Slim', category: 'Atasan', price: 300000, image: '👔' },
];

const CONTACTS_SECTIONS = [
  { 
    title: "M", 
    data: [{ id: "c1", name: "Mutiara (Owner)", phone: "0812-3456-7890", avatar: "👑" }] 
  },
  { 
    title: "S", 
    data: [{ id: "c3", name: "Sentra Kain", phone: "0855-1111-2222", avatar: "🏭" }] 
  },
];

// 2. HALAMAN PRODUK
const ProductsScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 6;

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const result = ALL_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
    );
    return result.slice(0, page * ITEMS_PER_PAGE);
  }, [searchQuery, page]);

  const onRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setPage(1);
      setIsRefreshing(false);
    }, 1500);
  };

  const handleLoadMore = () => {
    if (isLoadingMore || filteredData.length >= ALL_PRODUCTS.length) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setPage(prev => prev + 1);
      setIsLoadingMore(false);
    }, 1000);
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👕 Fashion Kita</Text>
        <View style={styles.searchBox}>
          <Text>🔍</Text>
          <TextInput 
            style={styles.searchInput} 
            placeholder="Cari pakaian..." 
            value={searchQuery}
            onChangeText={(txt) => {setSearchQuery(txt); setPage(1);}}
          />
        </View>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <View style={styles.imageContainer}><Text style={{ fontSize: 40 }}>{item.image}</Text></View>
            <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.productPrice}>Rp {item.price.toLocaleString('id-ID')}</Text>
          </View>
        )}
        ListFooterComponent={() => isLoadingMore ? <ActivityIndicator color="#6366f1" style={{margin: 10}} /> : null}
      />
    </View>
  );
};

// 3. HALAMAN KONTAK
const ContactsScreen = () => (
  <View style={styles.screenContainer}>
    <View style={styles.header}><Text style={styles.headerTitle}>📇 Kontak</Text></View>
    <SectionList
      sections={CONTACTS_SECTIONS}
      keyExtractor={(item) => item.id}
      stickySectionHeadersEnabled={true}
      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{title}</Text></View>
      )}
      renderItem={({ item }) => (
        <View style={styles.contactItem}>
          <View style={styles.avatar}><Text style={{ fontSize: 24 }}>{item.avatar}</Text></View>
          <View>
            <Text style={styles.contactName}>{item.name}</Text>
            <Text style={styles.contactPhone}>{item.phone}</Text>
          </View>
        </View>
      )}
    />
  </View>
);

// 4. MAIN APP
export default function App() {
  const [activeTab, setActiveTab] = useState("products");
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1 }}>{activeTab === "products" ? <ProductsScreen /> : <ContactsScreen />}</View>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => setActiveTab("products")}>
          <Text style={{ fontSize: 22, opacity: activeTab === "products" ? 1 : 0.3 }}>🛍️</Text>
          <Text style={[styles.navLabel, activeTab === "products" && styles.navLabelActive]}>Produk</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => setActiveTab("contacts")}>
          <Text style={{ fontSize: 22, opacity: activeTab === "contacts" ? 1 : 0.3 }}>📇</Text>
          <Text style={[styles.navLabel, activeTab === "contacts" && styles.navLabelActive]}>Kontak</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  screenContainer: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 22, fontWeight: '900' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', paddingHorizontal: 12, borderRadius: 10, marginTop: 10 },
  searchInput: { flex: 1, height: 40, marginLeft: 8 },
  columnWrapper: { justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 16 },
  productCard: { width: '48%', backgroundColor: '#fff', borderRadius: 12, padding: 12, elevation: 3 },
  imageContainer: { height: 90, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  productName: { fontWeight: 'bold', marginTop: 8, fontSize: 13 },
  productPrice: { color: '#059669', fontWeight: '800', fontSize: 13 },
  sectionHeader: { backgroundColor: '#f1f5f9', padding: 8, paddingHorizontal: 16 },
  sectionTitle: { fontWeight: 'bold', color: '#64748b' },
  contactItem: { flexDirection: 'row', padding: 16, alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  avatar: { width: 50, height: 50, backgroundColor: '#f1f5f9', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  contactName: { fontWeight: '700' },
  contactPhone: { color: '#94a3b8' },
  bottomNav: { flexDirection: 'row', height: 70, borderTopWidth: 1, borderTopColor: '#f1f5f9', backgroundColor: '#fff' },
  navButton: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navLabel: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
  navLabelActive: { color: '#6366f1', fontWeight: 'bold' }
});