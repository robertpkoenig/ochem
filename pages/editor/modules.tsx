
import BlueNavBar from '../../components/BlueNavBar'
import Layout from '../../components/Layout'
import { Plus } from 'react-feather'
import React from 'react'
import { PlusIcon } from '@heroicons/react/solid'
import ModulePopup from '../../components/ModulePopup'

export default class Modules extends React.Component {

    // TODO
    // make this a class component with state so that
    // I can show/hide the module creator popup

    // popupVisibile = false
    // popup = null

    // constructor(props: any) {
    //     super(props)
    // }

    // function log() {
    //     popupVisibile = !popupVisibile
    // }

    // if (popupVisibile) {
    //     popup = <ModulePopup />
    // }

    // return (

    //     <Layout
    //         title="Modules"
    //         subtitle="Create collections for modules you teach"
    //     >

    //         <div className="h-24 border border-dashed border-gray-200
    //                         rounded-lg text-gray-400 font-light flex
    //                         flex-col place-content-center items-center "
    //         >
    //             You don't have any modules yet
    //         </div>

    //         <button
    //             type="button"
    //             className="mt-6 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
    //             onClick={log}
    //         >
    //             <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
    //             New Module
    //         </button>


    //         {popup}

    //     </Layout>

//   )
}
