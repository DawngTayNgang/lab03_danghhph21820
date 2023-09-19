import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// import BouncyCheckbox from "react-native-bouncy-checkbox";
export default function App() {
  // tạo một mảng dữ liệu sẵn
  const Data_demo = [
    {
      id: 0,
      email: "dang_01@gmail.com",
      pass: "hihihihi@1",
    },
    {
      id: 1,
      email: "dang_02@gmail.com",
      pass: "hihihihi@2",
    },
    {
      id: 2,
      email: "dang_03@gmail.com",
      pass: "hihihihi@3",
    },
  ];
  //tạo state
  const [data, setData] = useState(Data_demo);
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  //định dạng cho item, set màu, sự kiện bấm
  const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.item, { backgroundColor }]}
    >
      <Text style={[styles.title, { color: textColor }]}>{item.email}</Text>
    </TouchableOpacity>
  );
  //tạo state để set sự thay đổi khi click vào
  const [selectedId, setSelectedId] = useState();
  const renderItem = ({ item }) => {
    if (item.id === selectedId) {
      Alert.alert(` email : ${item.email} \n pass: ${item.pass}`);
    }
    const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";
    const color = item.id === selectedId ? "white" : "black";

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };
  //validate ô input
  const [alert_email, update_alert_email] = useState("");
  const [alert_pass, update_alert_pass] = useState("");
  //validate email
  const isEmailValid = (email) => {
    // Biểu thức chính quy để kiểm tra địa chỉ email
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };
  //validate pass
  const isPasswordValid = (password) => {
    // Kiểm tra mật khẩu có ít nhất 8 ký tự và chứa ít nhất một ký tự đặc biệt
    const passwordRegex =
      /^(?=.*[A-Za-z0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };
  const [CheckMail, update_CheckMail] = useState(false);
  const validate_email = (text) => {
    if (text === "") {
      update_CheckMail(false);
      update_alert_email("Don't leave Email blank");
    } else if (!isEmailValid(text)) {
      update_CheckMail(false);
      update_alert_email("Please enter a valid email address");
    } else {
      update_CheckMail(true);
      update_alert_email("");
    }
  };
  const [CheckPass, update_CheckPass] = useState(false);
  const validate_pass = (text) => {
    if (text === "" || text.length < 8) {
      update_CheckPass(false);

      update_alert_pass("Password must be at least 8 characters.");
    } else if (!isPasswordValid(text)) {
      update_CheckPass(false);
      update_alert_pass("Password must be at least 1 special character.");
    } else {
      update_CheckPass(true);
      update_alert_pass("");
    }
  };
  //hàm thêm item
  const Add_Item = () => {
    const newItem = {
      id: Math.random().toString(),
      email: "Dữ liệu mới",
      pass: "hihihihi@3",
    };
    setData([...data, newItem]);
  };
  const Add_Item_login = () => {
    if (CheckMail && CheckPass) {
      const newItem = {
        id: Math.random().toString(),
        email: inputEmail, // Lấy giá trị từ ô input email
        pass: inputPassword, // Lấy giá trị từ ô input password
      };
      setData([...data, newItem]);
      setInputEmail("");
      setInputPassword("");
      update_CheckMail(false);
      update_CheckPass(false);
    } else if (!CheckMail || !CheckPass) {
      Alert.alert("Please enter the correct value");
    } else {
      Alert.alert("Please don't leave email and password blank");
    }
  };

  //hàm xóa item cuối
  const Delete_Last_Item = () => {
    if (data.length > 0) {
      const newData = [...data];
      newData.pop();
      setData(newData);
    }
  };

  //xóa một item mà đã chọn
  const Delete_Selected_Item = () => {
    if (selectedId !== undefined) {
      const newData = [...data];
      const indexToDelete = newData.findIndex((item) => item.id === selectedId);
      if (indexToDelete !== -1) {
        Alert.alert("Delete item success")
        newData.splice(indexToDelete, 1);
        setData(newData);
        setSelectedId(undefined);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe_area_view}>
      <View style={styles.container}>
        {/* tạo 2 ô text input,set sự kiện nhập cho nó*/}
        <TextInput
          style={styles.input}
          onChangeText={(email) => {
            setInputEmail(email); // Cập nhật giá trị nhập vào ô email
            validate_email(email); // Validate email
          }}
          placeholder="Email"
          value={inputEmail} // Đặt giá trị của ô input email
        />
        <Text style={styles.text_Alert}>{alert_email}</Text>
        <TextInput
          style={styles.input}
          onChangeText={(pass) => {
            setInputPassword(pass);
            validate_pass(pass);
          }}
          secureTextEntry={true}
          placeholder="Password"
          value={inputPassword}
        />
        <Text style={styles.text_Alert}>{alert_pass}</Text>

        {/* tạo một view mới để cho cái check box nằm ngang với button */}
        <View>
          {/* bấm add để thêm dữ liệu vào cuối mảng */}
          <TouchableOpacity onPress={Add_Item_login} style={styles.button_add}>
            <Text style={styles.text_button}>Confirm</Text>
          </TouchableOpacity>
        </View>
        {/* đổ dữ liệu bằng flatlist ra đây */}

        <FlatList
          data={data} // Sử dụng data thay vì Data_demo
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={data} // Thông báo khi data thay đổi
        />
        <TouchableOpacity onPress={Delete_Selected_Item}>
          {/* lấy cái selectedid để xóa */}
          <Text>Click to remove item selected</Text>
          {/* <Text>{selectedId}</Text> */}
        </TouchableOpacity>
        {/* như trên lớp */}

        <View style={styles.button_add_remove}>
          <TouchableOpacity onPress={Add_Item} style={styles.button_add}>
            <Text style={styles.text_button}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={Delete_Last_Item}
            style={styles.button_add}
          >
            <Text style={styles.text_button}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe_area_view: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  container: {
    position: "absolute",
    alignItems: "center",
    height: "80%",
    width: "100%",
  },
  item: {
    padding: 10,
    alignItems: "center",
    width: 300,
    marginVertical: 1,
    marginHorizontal: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    width: 300,
    margin: 10,
  },
  text_Alert: {
    color: "red",
    width: 300,
  },
  button_add: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: `#662549`,
    width: 100,
    alignItems: "center",
    margin: 10,
  },
  text_button: {
    color: "#fff",
    fontSize: 20,
  },
  button_add_remove: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
