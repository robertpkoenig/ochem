import { useContext, useEffect, useState } from "react";
import Section from "../../../persistence-model/SectionListing";
import { useRouter } from "next/router";
import Module from "../../../persistence-model/Module";
import PageLayout from "../../../components/common/PageLayout";
import StudentSectionCard from "../../../components/student/modules/StudentSectionCard";
import { AuthContext } from "../../../context/authContext";
import {
  arrayUnion,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import ScreenWithLoading from "../../../components/common/ScreenWithLoading";
import EmptyState from "../../../components/common/EmptyState";
import UserType from "../../../canvas/model/UserType";
import {
  DATE_RECORDS,
  MODULES,
  MODULE_ANALYTICS_RECORDS,
} from "../../../persistence-model/FirebaseConstants";
import Show from "../../../components/common/Show";

// This page displays all module content for the student.
// The student can practice exercises and tick them off.
export default function ModulePage() {
  const [module, setModule] = useState<Module>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [completedReactionIds, setCompletedReactionids] =
    useState<Set<string>>(null);

  const { user } = useContext(AuthContext);
  const db = getFirestore();
  const router = useRouter();

  // Fetch the module document from Firebase
  async function getData() {
    // Get the module Id from the URL path
    const moduleId = router.query.moduleId as string;
    // Find the 'address' of the module document in firebase
    const moduleDocRef = doc(db, MODULES, moduleId);
    const docSnap = await getDoc(moduleDocRef);
    setModule(docSnap.data() as Module);
    setCompletedReactionids(new Set<string>(user.completedReactionIds));
    setLoading(false);
  }

  // Runs once when the page loads and the user is logged in
  useEffect(() => {
    if (user) {
      getData();
      sendAnalyticsUpdate();
    }
  }, [user]);

  // Updates the module analytics object
  function sendAnalyticsUpdate() {
    // only do this if the user is a student
    if (user.type == UserType.STUDENT) {
      const moduleId = router.query.moduleId as string;

      const date = new Date();
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      const dateString = date.toISOString().substring(0, 10);

      const dateRecordDocLocation = doc(
        db,
        MODULE_ANALYTICS_RECORDS,
        moduleId,
        DATE_RECORDS,
        dateString
      );

      setDoc(
        dateRecordDocLocation,
        {
          date: dateString,
          studentIds: arrayUnion(user.userId),
        },
        { merge: true }
      );
    }
  }

  // Sets the reaction to 'checked' in the database
  function toggleReactionInCheckedReactions(reactionId: string) {
    const copyOfCheckedReactions = new Set<string>();

    completedReactionIds.forEach((value) => {
      copyOfCheckedReactions.add(value);
    });

    if (completedReactionIds.has(reactionId)) {
      copyOfCheckedReactions.delete(reactionId);
    } else {
      copyOfCheckedReactions.add(reactionId);
    }

    setCompletedReactionids(copyOfCheckedReactions);

    // The list of checked reactions is stored in the user.
    const db = getFirestore();
    const docRef = doc(db, "users", user.userId);
    updateDoc(docRef, {
      completedReactionIds: [...copyOfCheckedReactions],
    });
  }

  const emptyStateMessage = (
    <div className="text-center">
      <p className="font-bold">Whoops!</p>
      <p>Your lecturer has not published any content for this module</p>
      <p>Please tell them to click 'publish' on some of their reactions</p>
    </div>
  );

  const sectionListEmptyState = <EmptyState text={emptyStateMessage} />;

  // TODO refactor this
  // Why are these sections and reactionListings all values of objects and not arrays?
  let sectionList: React.ReactNode = null;

  const sections = Object.values(module?.sections || []);
  const nonEmptySections = sections.filter((section) => {
    const reactionListings = Object.values(section.reactionListings);
    return (
      reactionListings.filter((reactionListing) => reactionListing.visible)
        .length > 0
    );
  });
  const orderedNonEmptySections = nonEmptySections.sort(
    (a, b) => a.order - b.order
  );

  const sectionCards = orderedNonEmptySections.map((section) => {
    return (
      <StudentSectionCard
        module={module}
        section={section}
        completedReactionIds={completedReactionIds}
        checkAdditionFunction={toggleReactionInCheckedReactions} // What is this?
      />
    );
  });

  return (
    <ScreenWithLoading loading={loading}>
      <PageLayout
        title={module?.title}
        subtitle={module?.subtitle ? module.subtitle : null}
      >
        <Show if={sectionCards.length > 0}>
          <div className="flex flex-col gap-5 ">{sectionCards}</div>
        </Show>
        <Show if={sectionCards.length == 0}>{sectionListEmptyState}</Show>
      </PageLayout>
    </ScreenWithLoading>
  );
}
