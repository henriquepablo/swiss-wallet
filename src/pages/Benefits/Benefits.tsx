import React, { useEffect, useState } from "react";
import { FlatList, HStack, Text} from "@gluestack-ui/themed";
import HeaderWithPoints from "../../components/HeaderWithPoints";
import Titlle from "../../components/Title";
import { Box } from "@gluestack-ui/themed";
import DropShadow from "react-native-drop-shadow";
import { Alert, ScrollView, TouchableOpacity } from "react-native";
import api from "../../service/api";
import { useIsFocused } from "@react-navigation/native";

function Benefits():JSX.Element{

    const[benefits, setBenefits] = useState([]);
    const[status, setStatus] = useState([]);

    const focus = useIsFocused();

    async function benefitStatus() {
        const response = await api.get("/benefit/requests/current")
        .then((json) => {
            setBenefits(json.data.activeResponseDtos);
            setStatus(json.data.reqResponseDtos);
        })
        .catch((error) => {
            console.log(error)
        })
    }

    async function solicitarBenefits(id: string) {
        
        const response = await api.post('/benefit/requests', {
            "idBenefit": id
        })
        .then(() => {
            return Alert.alert("O beneficio foi solicitado");
        })
        .catch((error) => {
            console.log(error);
        })

        benefitStatus();
    }

    async function cancelarBenefit(id: string){
        const response = await api.delete(`/benefit/requests/${id}`)
        .then(() => {
            return Alert.alert('A solicitação foi cancelada')
        })
        .catch((error) => {
            console.log(error)
        })

        benefitStatus();
    }

    useEffect(() => {
        benefitStatus();
    }, [focus]);

    return(
        <ScrollView showsVerticalScrollIndicator={false}>
            <HeaderWithPoints/>

            <Box mb={-50} ml={22} mt={45}>
                <Text color="$black" fontWeight={"$bold"} fontSize={40} >
                    Beneficios
                </Text>
                <Text width={300} fontSize={16}>
                Confira a lista de beneficios de assinantes da AAPM
                </Text>
            </Box>

            <DropShadow style={{shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.5, shadowRadius: 4}}>
                <FlatList
                display={benefits.length == 0 ? 'none' : 'flex'}
                data={benefits}
                keyExtractor={(item: any) => item.id}
                renderItem={(item: any) => 

                
                    <Box mr={22} ml={22} borderRadius={10} bg="#fff" mt={60} mb={20} padding={20}>

                        <Text color="#000" fontWeight="$bold" fontSize={29} mb={5}>{item.item.title}</Text>
                        <Text  mt={5} mb={15} padding={5}  w={250}>{item.item.description}</Text>
                            
                        <TouchableOpacity onPress={() => solicitarBenefits(item.item.id)}>
                            <Box justifyContent="center" alignItems="center" mb={10}>
                                <Box w={200} h={40} bgColor="#C40601" alignItems="center" justifyContent="center" borderRadius={5}>
                                    <Text color="#fff" fontWeight={"$bold"}>Solicitar beneficio</Text>
                                </Box>
                            </Box>
                        </TouchableOpacity>
                    </Box>
                    
                    }

                scrollEnabled={true}
                horizontal={true}
                showsHorizontalScrollIndicator={false}/>       
            </DropShadow>


            <Text ml={25} color="#000" fontWeight="$bold" fontSize={32} mb={5} mt={benefits.length == 0 ? 60 : ''}>{status.length == 0 ? '' : 'Solicitados'}</Text>

            <DropShadow style={{shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.5, shadowRadius: 4}}>
                <FlatList
                data={status}
                keyExtractor={(item: any) => item.id}
                renderItem={(item: any) => 

                
                    <Box position="relative" mr={22} ml={22}  borderRadius={10} bg="#fff" mt={15} mb={20} padding={20}>
                        <Text color="#000" fontWeight="$bold" fontSize={26} mb={5}>{item.item.benefitActive.title}</Text>
                        <Text mt={5} w={250}>{item.item.benefitActive.description}</Text>
                        
                        <HStack mt={60}>

                           {item.item.status === 'APPROVED' || item.item.status === "CLOSED" || item.item.status === 'NOT_APPROVED' ? '' : (
                                <TouchableOpacity onPress={() => cancelarBenefit(item.item.id)}>
                                        <Text mr={22} mt={5} bgColor="#C40601"  padding={5} color="#fff" fontWeight={'$semibold'} position="absolute" bottom={10} left={0} borderRadius={5}>Cancelar solicitação</Text>
                                </TouchableOpacity>
                           )}
                           
                            <Text ml={22} mt={5} color="#000" fontWeight={'$semibold'} position="absolute" bottom={10} right={15}>{item.item.status}</Text>
                        </HStack>
                        
                    </Box>
                    
                }

                scrollEnabled={true}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                />   

            </DropShadow>

        </ScrollView>
    );
}

export default Benefits;