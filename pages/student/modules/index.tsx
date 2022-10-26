import PageLayout from "../../../components/common/PageLayout";
import React, { useContext, useEffect, useState } from "react";
import ModuleListing from "../../../persistence-model/ModuleListing";
import Link from "next/link";
import { AuthContext } from "../../../context/authContext";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import ScreenWithLoading from "../../../components/common/ScreenWithLoading";
import Button from "../../../components/common/buttons/Button";
import {
  MODULE_LISTINGS,
  UUID,
} from "../../../persistence-model/FirebaseConstants";

// This page lists all modules the student has access to.
// The student never sees this page if they only have access
// to one module
export default function StudentModules() {
  const [loading, setLoading] = useState<boolean>(true);
  const [moduleListings, setModuleListings] = useState<ModuleListing[]>([]);

  const { user } = useContext(AuthContext);
  const db = getFirestore();

  // Gets all module listings whose Id's are in this user's
  // list of module id's
  async function getData() {
    const q = query(
      collection(db, MODULE_LISTINGS),
      where(UUID, "in", user.moduleIds)
    );

    const querySnapshot = await getDocs(q);

    const fetchedModuleListings: ModuleListing[] = [];

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      fetchedModuleListings.push(doc.data() as ModuleListing);
    });

    setModuleListings(fetchedModuleListings);

    setLoading(false);
  }

  // This function runs once when the page is loaded
  // and the user is logged in
  useEffect(() => {
    if (user) {
      getData();
    }
  }, [user]);

  {
    /* The list of module cards */
  }
  const moduleList: React.ReactNode = (
    <div className="bg-white border border-gray-300 overflow-hidden rounded-md">
      <ul className="divide-y divide-gray-300">
        {moduleListings.map((moduleListing: ModuleListing) => (
          <li key={moduleListing.uuid} className="px-6 py-6">
            <div className="flex flex-row justify-between ">
              <div className="flex flex-col justify-center font-semibold">
                {moduleListing.name}
              </div>

              <div className="flex flex-row gap-2">
                <Link href={"/student/modules/" + moduleListing.uuid}>
                  <a>
                    <Button
                      size={"small"}
                      importance={"primary"}
                      text={"Practice"}
                      icon={null}
                      onClick={null}
                      extraClasses={""}
                    />
                  </a>
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <ScreenWithLoading loading={loading}>
      <PageLayout title="My modules" subtitle="">
        {moduleList}
      </PageLayout>
    </ScreenWithLoading>
  );
}
