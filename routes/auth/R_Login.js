const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const M_CreateUser = require('../../models/Login/M_CreateUser')
const os = require('os');
const bcrypt = require('bcryptjs')
const fetchuser = require('../../middleware/fetchuser')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

//Route 1 :::::::::::::Add New Users :::::::::::::::POST :'/api/auth/createuser'
router.post('/createuser', [
    body('name', 'Enter Name').isLength({min:5}),
    body('eemail', 'Enter Email').isEmail(),
    body('epassword', 'Enter Password').isLength({ min: 8 }),
    body('conpass', 'Enter Confirm Password').isLength({ min: 8 })
], async (req, res) => {
    const result = validationResult(req)
    let success = false;

    if(!result.isEmpty()){
        return res.status(200).json({success,error:result.errors[0].msg})
    }

    const { eemail, epassword, conpass, name } = req.body
    const hostname = os.hostname();

    const networkInterfaces = os.networkInterfaces();
    const staticIpAddresses = Object.keys(networkInterfaces)
        .reduce((ips, interfaceName) => {
            const interfaceInfo = networkInterfaces[interfaceName];
            const staticIpv4Addresses = interfaceInfo.filter(
                info => info.family === 'IPv4' && !info.internal
            );
            return ips.concat(staticIpv4Addresses.map(info => info.address));
        },[]);

    const ipString = staticIpAddresses.join(', ');

    try {

        let findEmail = await M_CreateUser.findOne({ email: eemail })

        if (findEmail) {
            return res.status(200).json({ success, error: "Email Already Exists" })
        }

        const salt = await bcrypt.genSalt(10)
        let secPass = await bcrypt.hash(epassword, salt)
        let secConPass = await bcrypt.hash(conpass, salt)

        if (secPass !== secConPass) {
            return res.status(200).json({ success, error: "Password don't match" })
        }

        findEmail = await M_CreateUser.create({
            name:name,
            email:eemail,
            password:secPass,
            machineName:hostname,
            IPAddress:ipString,
            lastLoginMachineName:hostname,
            lastLoginIPAddress:ipString
        })

        res.json({success:true,error:"Operation Successfully"})


    } catch (error) {
        return res.status(500).json({ success, error: `Internal Error Occured ${error.message}` })
    }
})


//Route 2 ::::::::::::Login users ::::::::::::::::POST :'/api/auth/login'
router.post('/login',[
    body('email','Enter Email').isEmail(),
    body('password','Enter Password').isLength({min:8})
],async(req,res)=>{
    const result = validationResult(req)
    let success = false;
    if(!result.isEmpty()){
        return res.status(200).json({success,error:result.errors[0].msg})
    }

    const {email, password} = req.body

    const hostname = os.hostname();

    const networkInterfaces = os.networkInterfaces();
    const staticIpAddresses = Object.keys(networkInterfaces)
        .reduce((ips, interfaceName) => {
            const interfaceInfo = networkInterfaces[interfaceName];
            const staticIpv4Addresses = interfaceInfo.filter(
                info => info.family === 'IPv4' && !info.internal
            );
            return ips.concat(staticIpv4Addresses.map(info => info.address));
        },[]);

    const ipString = staticIpAddresses.join(', ');

    try {

        const user = await M_CreateUser.findOne({email:email})

        if(!user){
            return res.status(200).json({success,error:"User not found"})
        }

        let name = user.name
        let isAdmin = user.isAdmin
        let userId = user._id

        const passCompare = await bcrypt.compare(password,user.password)

        if (!passCompare) {
            return res.status(401).json({success,error:'Invalid Password !!!'});
        }

        const data = {
            user: {
                id: user.id
            }
        }

        await M_CreateUser.updateMany({
            lastLoginMachineName:hostname,
            lastLoginIPAddress:ipString,
            updatedDate:Date.now()
        })

        const authToken = jwt.sign(data, JWT_SECRET)
        res.json({ success:true,authToken,userId,name,isAdmin })

        //res.json({authToken})

        
    } catch (error) {
        return res.status(500).json({ success, error: `Internal Error Occured ${error.message}` })
    }
})


module.exports = router;
