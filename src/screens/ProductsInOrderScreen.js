import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Button, FlatList, Modal, Animated, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as productActions from '../store/actions/products';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import Product from '../Components/Product';
import HeaderButton from '../Components/UI/HeaderButton';
import * as Colors from '../constants/Colors';
import AddProdcutModal from '../Components/AddProductModal';
import { Backdrop } from '../Components/Backdrop';

const ProductsInOrderScreen = (props) => {
	const items = useSelector(state => state.products.products)

    const [delayValue, setDelayValue] = useState(500)

    const [modalVisible, setModalVisible] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState()

    const dispatch = useDispatch();

    // const fadeAnim = useRef(new Animated.Value(0)).current;

    // const animation = () => Animated.spring(fadeAnim, {
    //     toValue: 1,
    //     tension: 20,
    //     useNativeDriver: true
    //   }).start();

    const loadProducts = useCallback(async () => {
        setErrorMsg(null)
        setIsRefreshing(true)
        try {
            await dispatch(productActions.fetchProducts())            
        } catch (error) {
            setErrorMsg(error.message)
        }
        setIsRefreshing(false)
    }, [dispatch, setIsLoading, setErrorMsg])

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', () => loadProducts())
        return () => {
            willFocusSub.remove()
        }
    }, [loadProducts])

    useEffect(() => {
        setIsLoading(true)
        loadProducts()
            .then(res => setIsLoading(false))
    }, [dispatch, loadProducts])


    const openModalFromNavbarHandler = useCallback(() => {
        setModalVisible(true)
    }, [setModalVisible])

    useEffect(() => {
        props.navigation.setParams({ openModal: openModalFromNavbarHandler });
    }, [openModalFromNavbarHandler]);

    const deleteHandler = async (id) => {
        await dispatch(productActions.removeItem(id))
    }

    if (errorMsg) {
        return (<View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
        <Text>Error</Text>
        <Button title='Try again' onPress={() => loadProducts()}/>
    </View>)
    }

    if (isLoading) {
        return <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
            <ActivityIndicator size='large' color={Colors.main}/>
        </View>
    }

    // const translateX = fadeAnim.interpolate({
    //     inputRange: [0, 1],
    //     outputRange: [delayValue, 1]
    // });

	return (
            <View style={styles.container}>
                <Backdrop visible={modalVisible} onPress={() => setModalVisible(!modalVisible)} />
                {
                    items.length === 0
                    ? <View style={styles.message}>
                        <Text style={{textAlign: 'center'}}>
                            Пока тут нет никаких товаров. 
                            Добавьте чтобы не забыть!
                        </Text>
                    </View>
                    : <FlatList
                        style={{opacity: 1, width: '100%'}}
                        onRefresh={loadProducts}
                        refreshing={isRefreshing}
                        contentContainerStyle={styles.container}
                        data={items}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => <View>
                                                    <Product
                                                        setDelayValue={setDelayValue}
                                                        id={item.id} 
                                                        name={item.name} 
                                                        comment={item.comment} 
                                                        onRemove={() => deleteHandler(item.id)} 
                                                        bought={item.bought}
                                                        image={item.image}
                                                    />
                                                </View>}
                    />
                }
                <Modal
                    style={styles.modal}
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                <View style={styles.centered}>
                    <AddProdcutModal setModalVisible={setModalVisible}/>
                </View>
                </Modal>
            </View>
   )
}

ProductsInOrderScreen.navigationOptions = navData => {

    const openModal = navData.navigation.getParam('openModal')

    return {
        headerTitle: 'Что Купить',
        headerLeft: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
            title='MenuItem'
            onPress = {() => {navData.navigation.toggleDrawer()}}
            iconName={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu' }
        />
        </HeaderButtons>,
        headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title='AddItem'
                    onPress = {openModal}
                    iconName={Platform.OS === 'ios' ? 'add' : 'add-circle' }
                />
        </HeaderButtons>
    }
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
	container: {
        paddingVertical: 10,
        flexDirection: 'column',
		justifyContent: 'flex-start',
        alignItems: 'center'
	},
    message: {
        width: '50%',
        marginVertical: 20
    },
    modal: {
        zIndex: 1001
    },
  });

export default ProductsInOrderScreen;