import { StyleSheet, Text, View, ScrollView, FlatList, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { f, h, w } from 'walstar-rn-responsive';
import { globalColors } from '../../../Theme/globalColors';
import CommonButton from '../../../Components/CommonButton';
import { DataTable } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import ExcelJS from 'exceljs';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';
import NoData from '../../Common/Nodata';
import AppBar from '../../../Components/AppBar';
import UserSearchBar from '../../../Components/UserSearchBar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobReport } from '../../../Redux/Slices/jobReportSlice';
import SkeltonLoader from '../../../Components/SkeltonLoader';

const JobsReport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filtereditems, setFiltereditems] = useState([]);
  const { t } = useTranslation();


  //filteration via query
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFiltereditems(items);
    } else {
      const filteredData = items?.filter(item =>
        item?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFiltereditems(filteredData);
    }
  }, [searchQuery, items]);


    const dispatch = useDispatch();

    const { jobReportData, loading, error } = useSelector((state) => state.jobReport);

   //fake table data
  const [items,setItems] = useState();

      useEffect(() => {
        dispatch(fetchJobReport());
      }, [dispatch]);

      useEffect(() => {
        if (jobReportData.jobs) {
          setItems(jobReportData.jobs);
          setFiltereditems(jobReportData.jobs); 
        }
      }, [jobReportData,loading]);

        const cleanHtmlContent = (htmlString) => {
          if (!htmlString) return '';
          
          // Remove HTML tags and convert HTML entities to normal characters
          return htmlString
            .replace(/<[^>]*>/g, '') // Remove all HTML tags
            .replace(/&nbsp;/g, ' ') // Replace &nbsp; with regular space
            .replace(/&amp;/g, '&') // Replace &amp; with &
            .replace(/&lt;/g, '<') // Replace &lt; with <
            .replace(/&gt;/g, '>') // Replace &gt; with >
            .replace(/&quot;/g, '"') // Replace &quot; with "
            .replace(/&#39;/g, "'") // Replace &#39; with '
            .trim(); // Remove extra whitespace
        };

   // pdf creation
   const createPDF = async () => {
    const htmlContent = generateHTML(filtereditems); // Use filtereditems instead of items
    let options = {
      html: htmlContent,
      fileName: 'Jobs Report',
    };

    try {
      let file = await RNHTMLtoPDF.convert(options);
      if (Platform.OS === 'android' && file.filePath) {
        const downloadsPath = `${RNFS.DownloadDirectoryPath}/Jobs Report.pdf`;
        await RNFS.moveFile(file.filePath, downloadsPath);
        alert(`Pdf File is saved to : ${downloadsPath}`);
      } else {
        alert(`PDF File is saved to: ${file.filePath}`);
      }
    } catch (error) {
        console.log('Error generating PDF:', error);
    }
  };

  const generateHTML = (data) => {
    return `<!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Jobs Report</title>
      <style>
          table {
              border-collapse: collapse;
              width: 100%;
          }
          th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
          }
          th {
              background-color: #f2f2f2;
          }
      </style>
      </head>
      <body>
      <h3 style="text-align:center"> Jobs Report </h3>
      
      <table id="jobsTable">
          <thead>
              <tr>
                <th>Title</th>
                <th>Summary</th>
                <th>Location</th>
                <th>Created Date</th>
                <th>Openings</th>
                <th>Applications</th>
                <th>Status</th>
              </tr>
          </thead>
          <tbody id="jobsTableBody">
            ${data.map(item => `
              <tr>
              <td>${item?.title || 'N/A'}</td>
              <td>${cleanHtmlContent(item?.summary) || 'N/A'}</td>
              <td>${item?.location || 'N/A'}</td>
              <td>${item?.created_at || 'N/A'}</td>
              <td>${item?.openings || 'N/A'}</td>
              <td>${item?.applications || 'N/A'}</td>
              <td>${item?.status || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
      </table>
      </body>
      </html>`;
  };


  //excel creation
  const generateShareableExcel = async () => {
  const fileName = 'Jobs Report.xlsx';
  
  try {
    // For Android
    let fileUri;
    if (Platform.OS === 'android') {
      fileUri = `${RNFS.DownloadDirectoryPath}/${fileName}`;
    } else {
      // For iOS
      fileUri = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    }
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Gram Job';
    workbook.created = new Date();
    const worksheet = workbook.addWorksheet('Jobs Report', {});
    
            // Updated columns to match your data structure
    worksheet.columns = [
      { header: 'Title', key: 'title', width: 20 },
      { header: 'Summary', key: 'summary', width: 30 },
      { header: 'Location', key: 'location', width: 15 },
      { header: 'Created Date', key: 'createdDate', width: 15 },
      { header: 'Openings', key: 'openings', width: 10 },
      { header: 'Applications', key: 'applications', width: 12 },
      { header: 'Status', key: 'status', width: 12 },
    ];

            // Add rows with your actual data structure
    filtereditems.map((item) => 
      worksheet.addRow({ 
        title: item?.title || 'N/A',
        summary: cleanHtmlContent(item?.summary) || 'N/A',
        location: item?.location || 'N/A',
        createdDate: item?.created_at || 'N/A',
        openings: item?.openings || 'N/A',
        applications: item?.applications || 'N/A',
        status: item?.status || 'N/A'
      })
    );
    const buffer = await workbook.xlsx.writeBuffer();
    const nodeBuffer = Buffer.from(buffer);
    const bufferStr = nodeBuffer.toString('base64');
    await RNFS.writeFile(fileUri, bufferStr, 'base64');
      alert(`Excel File is saved to : ${fileUri}`);
  } catch (error) {
    console.log('Error generating or saving Excel file:', error);
  }
};

    if (loading) return <SkeltonLoader />;  
    if (error) return
    (<>
      <AppBar navtitle={t('Jobs Report')} />
      <NoData text={'No Matching Job Report'}/>
    </>);  
 
  //report screen
  return (
    <View style={{flex:1,backgroundColor:globalColors.backgroundshade}}>
      <AppBar navtitle={t('Jobs Report')}/>
      {/* <ScrollView showsVerticalScrollIndicator={false}> */}
        <UserSearchBar handleSearch={handleSearch} placeholder={t('searchPlaceholdejobsreport')}/>
        <View style={{flexDirection:'row',marginBottom:h(4), marginHorizontal:'10%', gap:w(10),justifyContent:'space-between'}}>
          <CommonButton btnstyles={{paddingVertical:w(1)}} onpress={createPDF} title={t('Export Pdf')} />
          <CommonButton btnstyles={{paddingVertical:w(1)}} onpress={generateShareableExcel} title={t('Export Excel')}/>
        </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <DataTable >
      <DataTable.Header style={{backgroundColor:globalColors.shinygrey,borderBottomColor:globalColors.shinygrey,height:h(8),alignItems:'center'}} >
        <DataTable.Title style={styles.datatablecellHead}><Text style={styles.txtHead}>Title</Text></DataTable.Title>
        <DataTable.Title style={styles.datatablecellHead}><Text style={styles.txtHead}>Summary</Text></DataTable.Title>
        <DataTable.Title style={styles.datatablecellHead}><Text style={styles.txtHead}>Location</Text></DataTable.Title>
        <DataTable.Title style={styles.datatablecellHead}><Text style={styles.txtHead}>Created Date</Text></DataTable.Title>
        <DataTable.Title style={styles.datatablecellHead}><Text style={styles.txtHead}>Openings</Text></DataTable.Title>
        <DataTable.Title style={styles.datatablecellHead}><Text style={styles.txtHead}>Applications</Text></DataTable.Title>
        <DataTable.Title style={styles.datatablecellHead}><Text style={styles.txtHead}>Status</Text></DataTable.Title>
      </DataTable.Header>
      <FlatList
              data={filtereditems}
              renderItem={({item, index}) => (
                <DataTable.Row
                  style={{
                    borderWidth: w(0.4),
                    borderColor: globalColors.shinygrey,
                    backgroundColor: globalColors.pinkishwhite,
                  }}
                  key={index}>
                  <DataTable.Cell
                    style={[styles.datatablecell, {marginStart: w(0)}]}>
                    <Text style={styles.txtitem}>{item?.title}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.datatablecell}>
                    <Text style={styles.txtitem}>{cleanHtmlContent(item?.summary)}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.datatablecell}>
                    <Text style={styles.txtitem}>{item?.location}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.datatablecell}>
                    <Text style={styles.txtitem}>{item?.created_at}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.datatablecell}>
                    <Text style={styles.txtitem}>{item?.openings}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.datatablecell}>
                    <Text style={styles.txtitem}>{item?.applications}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.datatablecell}>
                    <Text style={styles.txtitem}>{item?.status}</Text>
                  </DataTable.Cell>
                </DataTable.Row>
              )}
              ListEmptyComponent={<NoData text={'No Matching Job Report'} />}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{paddingBottom: h(2)}}
              showsVerticalScrollIndicator={false}
            />
          </DataTable>
      </ScrollView> 
      {/* </ScrollView> */}
    </View>
  )
}

export default  JobsReport 


const styles = StyleSheet.create({
  datatablecell:{
    width:w(33),
    justifyContent:'flex-start',
    fontSize: f(2), 
    marginStart:w(2),
  },
  datatablecellHead:{
    width:w(33),
    justifyContent:'flex-start',
    fontSize: f(2), 
    alignItems:'center'
    },
  txtitem:{
    color:globalColors.black,
    fontSize:f(1.6),
    fontFamily:'BaiJamjuree-Medium',
    paddingVertical:h(2)
  },
  txtHead:{
    color:globalColors.black,
    fontSize:f(1.8),
    fontFamily:'BaiJamjuree-SemiBold',
    fontWeight:'bold'
  }
})