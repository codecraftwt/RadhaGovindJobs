import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useState } from 'react'
import { globalColors } from '../Theme/globalColors'
import { f, h, w } from 'walstar-rn-responsive'
import { dustbin, horizontalline, penciledit } from '../Theme/globalImages'
import DeleteModal from './DeleteModal'
import AddCategoryModal from './AddCategoryModal'


const JobCategoryCard = ({modal_title, showedit, showdelete, cat_id, handleAddData, deleteItem, id, title, subtitle, setSelectedId }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <AddCategoryModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={({ field1 }) => { handleAddData(field1, id, cat_id) }}
        modal_title={modal_title}
        btntitle={"Update"}
        value={title}
      />
      <DeleteModal itemName={title} onDelete={() => deleteItem(id)} visible={showDeleteModal} onCancel={() => setShowDeleteModal(false)} />
      <View style={{ gap: h(-0.7) }}>
        <Text style={styles.title}>{title?.length < 30 ? title : `${title?.slice(0,29)}..`}</Text>
        <Text style={styles.subtitle}>{subtitle?.length < 30 ? subtitle : `${subtitle?.slice(0,29)}..`}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {showedit && (
           <TouchableOpacity style={{paddingVertical:w(2),paddingStart:w(2)}} onPress={() => setModalVisible(true)}>
           <Image style={{ height: w(4.6), width: w(4.9) }} source={penciledit} resizeMode='contain' />
         </TouchableOpacity>
        )}
        <Image style={{ height: w(6), width: w(3.5) }} source={horizontalline} resizeMode='contain' />
        {showdelete && (
          <TouchableOpacity style={{paddingVertical:w(2),paddingEnd:w(2)}} onPress={() => setShowDeleteModal(!showDeleteModal)}>
            <Image style={{ height: w(4.9), width: w(4.9) }} source={dustbin} resizeMode='contain' />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default JobCategoryCard

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalColors.white,
    marginHorizontal: '5%',
    marginVertical: h(1),
    width: '90%',
    elevation: 4,
    paddingStart: '5%',
    paddingEnd: '2%',
    paddingVertical: h(1.3),
    borderRadius: w(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'

  },
  title: {
    fontSize: f(1.90),
    fontFamily: 'BaiJamjuree-SemiBold',
    color: globalColors.darkblack
  },
  subtitle: {
    fontSize: f(1.45),
    fontFamily: 'BaiJamjuree-Medium',
    color: globalColors.navypurple
  }
})